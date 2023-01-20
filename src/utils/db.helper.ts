import { SelectQueryBuilder } from 'typeorm';

export function conditionUtils<T>(queryBuilder: SelectQueryBuilder<T>, obj) {
	(Reflect.ownKeys(obj) as string[]).forEach((key) => {
		queryBuilder.andWhere(obj[key] ? `${key}=:${key}` : '1=1', {
			[key]: obj[key],
		});
	});

	return queryBuilder;
}
