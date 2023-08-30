#!/bin/bash

#
# Poor man's docker cleanup. The 'head' command is used to limit how
# much artifact garbage is collected per invocation. All failures are
# ignored.
#
docker-gc() {
   exited_containers=$(docker ps -f status=exited -q | head)
   if [ -n "$exited_containers" ]; then
      docker rm -v $exited_containers > /dev/null 2>&1
   fi

   unused_images=$(docker images -q -f dangling=true | head)
   if [ -n "$unused_images" ]; then
      docker rmi $unused_images > /dev/null 2>&1
   fi
}

die() {
   err=$?
   msg=$1
   if [ -n "$msg" ]; then
      echo "$msg" >&2
   fi
   echo "Failed with exit code $err." >&2
   exit $err
}

#
# Setup build system supplied environment variables.
#
BUILD_SOURCE_PATH=$(pwd)
BUILD_SOURCE_BRANCH=${BUILD_SOURCE_BRANCH:-UNKNOWN}
BUILD_SOURCE_REVISION=${BUILD_SOURCE_REVISION:-UNKNOWN}
BUILD_INSTANCE_NUMBER=${BUILD_INSTANCE_NUMBER:-UNKNOWN}
BUILD_PROJECT_VERSION=${BUILD_PROJECT_VERSION:-UNKNOWN}

#
# If project version matches pattern release*, trim the prefix.
#
if  [[ $BUILD_PROJECT_VERSION == release* ]] ;
		then
		BUILD_PROJECT_VERSION_SRC=$BUILD_PROJECT_VERSION
		BUILD_PROJECT_VERSION=$(echo $BUILD_PROJECT_VERSION_SRC | sed -e 's/^release[^0-9]*//')
		echo "The BUILD_PROJECT_VERSION is identified as release, trim the release prefix. $BUILD_PROJECT_VERSION_SRC -> $BUILD_PROJECT_VERSION";
fi;

BUILD_RELEASE_VERSION=${BUILD_PROJECT_VERSION}.${BUILD_SOURCE_BRANCH}.${BUILD_SOURCE_REVISION}.${BUILD_INSTANCE_NUMBER}

#
# Check Docker daemon is running.
#
docker version > /dev/null 2>&1 || die "Could not connect to Docker daemon."

#
# Perform an incremental cleanup up of old docker artifacts before starting build.
#
docker-gc

#
# Build project inside a clean docker build environment sandbox.
#
echo "================== Building in sandboxed build environment =================="
echo "BUILD_SOURCE_PATH:     $BUILD_SOURCE_PATH"
echo "BUILD_SOURCE_BRANCH:   $BUILD_SOURCE_BRANCH"
echo "BUILD_SOURCE_REVISION: $BUILD_SOURCE_REVISION"
echo "BUILD_INSTANCE_NUMBER: $BUILD_INSTANCE_NUMBER"
echo "BUILD_PROJECT_VERSION: $BUILD_PROJECT_VERSION"
echo "BUILD_RELEASE_VERSION: $BUILD_RELEASE_VERSION"

#DOCKER_REGISTRY_DOMAIN=hub.ol.epicgames.net
#DOCKER_REGISTRY_NAMESPACE=epicgames

#
# Use a Nexus reverse proxy if NEXUS_PROXY_HOST is set or a local container is running.
#
if [ -z "$NEXUS_PROXY_HOST" ]; then
   NEXUS_PROXY_RUNNING=$(docker inspect --format "{{.State.Running}}" nexus-proxy 2> /dev/null)
   if [ "$NEXUS_PROXY_RUNNING" == "true" ]; then
      NEXUS_PROXY_HOST=$(docker inspect --format "{{.NetworkSettings.IPAddress}}" nexus-proxy)
      if [ -z "$NEXUS_PROXY_HOST" ]; then
         NEXUS_PROXY_HOST=$(docker inspect --format "{{.NetworkSettings.IPAddress}}" pod-network)
      fi
   fi
fi
if [ -n "$NEXUS_PROXY_HOST" ]; then
   echo "Found Nexus proxy. Mapping nexus-server-01.ol.epicgames.net to ${NEXUS_PROXY_HOST}."
   HOST_OPTIONS="--add-host nexus-server-01.ol.epicgames.net:$NEXUS_PROXY_HOST"
fi

#
# Impersonate the caller's UID/GID so docker builds will
# create artifacts with the same permissions as the external
# volume. This is necessary because docker currently does not
# support user namespace root remapping.
#
# see:
#
#    https://github.com/docker/docker/issues/7906
#    https://github.com/docker/docker/pull/11253
#
if [ -n "$(uname -a | grep Linux)" ]; then
   UID_GID_IMPERSONATION_OPTIONS="--user $(id -u):$(id -g)"
else
   #
   # The Docker daemon on Mac OS X and Windows runs in a lightweight
   # VM. It automatically mounts and shares the /Users path from the
   # host's filesystem with docker:staff permissions. This allows the
   # VM and launched containers to read and write files back to the
   # host OS.
   #
   UID_GID_IMPERSONATION_OPTIONS="--user 1000:50"
fi

#docker pull ${DOCKER_REGISTRY_DOMAIN}/${DOCKER_REGISTRY_NAMESPACE}/ecom-build-env
#docker run \
#   --cap-drop ALL \
#   $HOST_OPTIONS \
#   $UID_GID_IMPERSONATION_OPTIONS \
#   --volume /$BUILD_SOURCE_PATH://workspace \
#   --workdir //workspace \
#   --interactive \
#   --env "BUILD_SOURCE_BRANCH=$BUILD_SOURCE_BRANCH" \
#   --env "BUILD_SOURCE_REVISION=$BUILD_SOURCE_REVISION" \
#   --env "BUILD_INSTANCE_NUMBER=$BUILD_INSTANCE_NUMBER" \
#   --env "BUILD_PROJECT_VERSION=$BUILD_PROJECT_VERSION" \
#   --env "BUILD_RELEASE_VERSION=$BUILD_RELEASE_VERSION" \
#   --env "BUILD_CREDENTIALS_NEXUS_USERNAME=${BUILD_CREDENTIALS_NEXUS_USERNAME:-UNKNOWN}" \
#   --env "BUILD_CREDENTIALS_NEXUS_PASSWORD=${BUILD_CREDENTIALS_NEXUS_PASSWORD:-UNKNOWN}" \
#   --env "BUILD_CREDENTIALS_ARTIFACTS_USERNAME=${BUILD_CREDENTIALS_ARTIFACTS_USERNAME:-UNKNOWN}" \
#   --env "BUILD_CREDENTIALS_ARTIFACTS_PASSWORD=${BUILD_CREDENTIALS_ARTIFACTS_PASSWORD:-UNKNOWN}" \
#   --env "BUILD_CREDENTIALS_TEAM_ONLINE_PEM=$BUILD_CREDENTIALS_TEAM_ONLINE_PEM" \
#   --rm \
#   ${DOCKER_REGISTRY_DOMAIN}/${DOCKER_REGISTRY_NAMESPACE}/ecom-build-env $@ || die

#
# Only build and push runtime images for release target.
#
if [ -z "$(echo $@ | awk '{print $0 }' RS=' ' | grep release)" ]; then
   exit 0
fi

#
# Build project runtime docker images. Note, image names are created based
# on the Dockerfile suffix (e.g. Dockerfile.foo-service -> foo-service).
#
DOCKER_IMAGE_TAG=$(echo ${BUILD_RELEASE_VERSION} | awk '{ print tolower($0) }')
for DOCKERFILE in $(ls Dockerfile*); do
   DOCKER_IMAGE_NAME=${DOCKER_REGISTRY_DOMAIN}/${DOCKER_REGISTRY_NAMESPACE}/$(echo $DOCKERFILE | cut -d'.' -f2)
   echo "========== Building image ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} from ${DOCKERFILE}. =========="

   # to read base image info from the docker file
   BASE_IMG=$(sed -e "s/\r//g" $DOCKERFILE| sed -n -e "/^[Ff][Rr][Oo][Mm][ TAB]*/s///p")
   BASE_IMG_NAME=$(echo $BASE_IMG|sed -e "s/:.*//")
   BASE_IMG_VERSION_LITERAL=$(echo $BASE_IMG|sed -n -e "/[^:]*:/s///p")
   if [[ $BASE_IMG_VERSION_LITERAL == '' ]]; then
      BASE_IMG_VERSION_LITERAL=latest
   fi
   BASE_IMG_VERSION_LC="$(echo $BASE_IMG_VERSION_LITERAL| awk '{ print tolower($0) }')"

   #The variable hold the accurate base image version
   BASE_IMG_VERSION=$BASE_IMG_VERSION_LITERAL

   #if the base image tag is latest, we will check if the image id is changed after the build completed.
   BASE_IMG_ID=''

   if [[ $BASE_IMG_VERSION_LC == '' || $BASE_IMG_VERSION_LC == 'latest' ]]; then
     docker pull -q $BASE_IMG
     BASE_IMG_ID=$(docker inspect --format='{{.Id}}' $BASE_IMG)
     BASE_IMG_VERSION=$(docker inspect --format='{{range $l,$v := .Config.Labels}}{{if eq $l "com.epicgames.docker.img-version"}}{{$v}}{{end}}{{end}}' $BASE_IMG)
     if [[ $BASE_IMG_VERSION == '' ]]; then
        BASE_IMG_VERSION=$BASE_IMG_VERSION_LITERAL
     fi
     echo "Got the accurate build version [$BASE_IMG_VERSION] from the latest build."
   fi

   #
   # Build project inside a clean docker build environment sandbox.
   #
   echo "BASE_IMG_NAME:      $BASE_IMG_NAME"
   echo "BASE_IMG_VERSION:   $BASE_IMG_VERSION"
   echo "IMG_NAME:           $DOCKER_IMAGE_NAME"
   echo "IMG_VERSION:        $DOCKER_IMAGE_TAG"

   docker build --file $DOCKERFILE --pull --rm --tag $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG \
      --build-arg BASE_IMG_NAME=$BASE_IMG_NAME \
      --build-arg BASE_IMG_VERSION=$BASE_IMG_VERSION \
      --build-arg IMG_NAME=$DOCKER_IMAGE_NAME \
      --build-arg IMG_VERSION=$DOCKER_IMAGE_TAG \
      --build-arg IMG_BUILD_DATE=$(date +'%Y%m%d') \
      . || die

   if [[ $BASE_IMG_VERSION_LC == '' || $BASE_IMG_VERSION_LC == 'latest' ]]; then
     if [[ $BASE_IMG_ID != "$(docker inspect --format='{{.Id}}' $BASE_IMG)" ]]; then
       echo 'Error: Base image id was changed during build process, the build label needs updates, please rebuild the image.' && exit 1
     fi
   fi
   docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG || die
done

#
# TeamCity hook to update variables based on the outcome of this build. Required
# to propagate values through a build chain.
#
# see: https://confluence.jetbrains.com/display/TCD7/Build+Script+Interaction+with+TeamCity
#
echo "##teamcity[setParameter name='env.BUILD_RELEASE_VERSION' value='$BUILD_RELEASE_VERSION']"