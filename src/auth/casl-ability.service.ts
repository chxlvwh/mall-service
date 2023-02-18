import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserService } from '../user/user.service';
import { getEntities } from '../utils/common';

@Injectable()
export class CaslAbilityService {
	constructor(private userService: UserService) {}
	async forRoot(username: string) {
		// 针对系统的 -》createUser XX System
		const { can, build } = new AbilityBuilder(createMongoAbility);
		const user = await this.userService.find(username);
		// 获取当前用户可以有权限访问的路径
		user.roles.forEach((role) => {
			role.menus.forEach((menu) => {
				const actions = menu.acl.split(',');
				for (let i = 0; i < actions.length; i++) {
					const action = actions[i].trim();
					can(action, getEntities(menu.path));
				}
			});
		});
		// can('manage', 'all');
		// menu 名称、路径、acl ->actions -> 名称、路径->实体对应
		// path -> prefix -> 写死在项目代码里

		// 其他思路：acl -> 表来进行存储 -> LogController + Action
		// log -> sys:log -> sys:log:read, sys:log:write ...
		// ability.can
		// @CheckPolicies((ability) => ability.cannot(Action, User, ['']))

		return build({
			detectSubjectType: (object) => object.constructor,
		});
	}
}
