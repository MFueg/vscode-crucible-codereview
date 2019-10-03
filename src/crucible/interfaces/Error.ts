export type ErrorCode =
	| 'IllegalArgument'
	| 'IllegalState'
	| 'NotFound'
	| 'NotPermitted'
	| 'PermaIdFormat'
	| 'ReviewContentTooLarge';

export interface Error {
	code: ErrorCode;
	message: string;
}
