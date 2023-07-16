// 自定义验证器：根据条件决定字段是否必填
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { registerDecorator } from 'class-validator';
export function IsConditionalRequired(field, value, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsConditionalRequired',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(v, args) {
					const scope = args.object[field];
					if (scope === value) {
						return args.object[args.property] && args.object[args.property].length > 0; // 有范围限制时，productIds 必填
					}
					return true; // 无范围限制时，productIds 可选
				},
			},
		});
	};
}
