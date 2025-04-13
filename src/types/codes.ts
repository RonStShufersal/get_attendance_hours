export const AUTOMATION_RESULT_CODE = {
	OK: '0',
	ERROR: '1',
} as const;

export type TAutomationResultCode = (typeof AUTOMATION_RESULT_CODE)[keyof typeof AUTOMATION_RESULT_CODE];
