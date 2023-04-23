import { MigrationInterface, QueryRunner } from 'typeorm';

export class menus1676645616606 implements MigrationInterface {
	name = 'menus1676645616606';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE \`menus\`
                                 (
                                     \`id\`    int          NOT NULL AUTO_INCREMENT,
                                     \`name\`  varchar(255) NOT NULL,
                                     \`path\`  varchar(255) NOT NULL,
                                     \`order\` int          NOT NULL,
                                     \`acl\`   varchar(255) NOT NULL,
                                     PRIMARY KEY (\`id\`)
                                 ) ENGINE=InnoDB`);
		await queryRunner.query(`CREATE TABLE \`role_menus\`
                                 (
                                     \`menusId\` int NOT NULL,
                                     \`rolesId\` int NOT NULL,
                                     INDEX       \`IDX_cf82e501e9b61eab5d815ae3b0\` (\`menusId\`),
                                     INDEX       \`IDX_135e41fb3c98312c5f171fe9f1\` (\`rolesId\`),
                                     PRIMARY KEY (\`menusId\`, \`rolesId\`)
                                 ) ENGINE=InnoDB`);
		await queryRunner.query(`ALTER TABLE \`role_menus\`
            ADD CONSTRAINT \`FK_cf82e501e9b61eab5d815ae3b0a\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE \`role_menus\`
            ADD CONSTRAINT \`FK_135e41fb3c98312c5f171fe9f1c\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_135e41fb3c98312c5f171fe9f1c\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_cf82e501e9b61eab5d815ae3b0a\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_135e41fb3c98312c5f171fe9f1\` ON \`role_menus\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_cf82e501e9b61eab5d815ae3b0\` ON \`role_menus\``,
		);
		await queryRunner.query(`DROP TABLE \`role_menus\``);
		await queryRunner.query(`DROP TABLE \`menus\``);
	}
}
