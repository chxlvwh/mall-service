import { TypeormFilter } from '../filters/typeorm.filter';
import { UseFilters } from '@nestjs/common';

export function TypeORMFilter() {
	return UseFilters(new TypeormFilter());
}
