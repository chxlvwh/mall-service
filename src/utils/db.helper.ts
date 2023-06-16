import { SelectQueryBuilder } from 'typeorm';

export function conditionUtils<T>(queryBuilder: SelectQueryBuilder<T>, obj) {
	(Reflect.ownKeys(obj) as string[]).forEach((key) => {
		queryBuilder.andWhere(
			obj[key].value || obj[key].value === 0
				? obj[key].isLike
					? `${key} LIKE :${key}`
					: `${key}=:${key}`
				: '1=1',
			{
				[key]: obj[key].isLike ? `%${obj[key].value}%` : obj[key].value,
			},
		);
		console.log(
			'[db.helper.ts:] ',
			obj[key].value ? (obj[key].isLike ? `${key} LIKE :${key}` : `${key}=:${key}`) : '1=1',
			{
				[key]: obj[key].isLike ? `%${obj[key].value}%` : obj[key].value,
			},
		);
	});

	return queryBuilder;
}

export function pagingFormat(result, current, pageSize) {
	return {
		elements: result[0],
		paging: {
			current: Number(current) || 1,
			pageSize: Number(pageSize) || 10,
			total: result[1],
		},
	};
}
