import { SetMetadata } from '@nestjs/common';
import { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { ActionEnum } from '../../enum/action.enum';

export enum CHECK_POLICIES_KEY {
	HANDLER = 'CHECK_POLICIES_HANDLER',
	CAN = 'CHECK_POLICIES_CAN',
	CANNOT = 'CHECK_POLICIES_CANNOT',
}

// GUARDS -> router meta -> @CheckPolicies @Can @Cannot

export type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;
export type CaslHandlerType = PolicyHandlerCallback | PolicyHandlerCallback[];

// handlers 与 can/cannot的区别是，handlers是传的函数，这个函数中是返回通过can/cannot判断的结果
// 比如：@CheckPolicies((ability) => ability.can(ActionEnum.Read, Logs)) 就相当于是 @Can(ActionEnum.Read, Logs)
// 比如：@CheckPolicies((ability) => ability.cannot(ActionEnum.Read, Logs)) 就相当于是 @Cannot(ActionEnum.Read, Logs)
/** @CheckPolicies -> handler -> ability => boolean */
export const CheckPolicies = (...handlers: PolicyHandlerCallback[]) =>
	SetMetadata(CHECK_POLICIES_KEY.HANDLER, handlers);

/** @Can -> Action, Subject, Conditions */
export const Can = (action: ActionEnum, subject: InferSubjects<any>, conditions?: any) =>
	SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) => ability.can(action, subject, conditions));

/** @Cannot -> Action, Subject, Conditions */
export const Cannot = (action: ActionEnum, subject: InferSubjects<any>, conditions?: any) =>
	SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) => ability.cannot(action, subject, conditions));
