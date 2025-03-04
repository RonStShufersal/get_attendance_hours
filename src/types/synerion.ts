export interface SynerionResponse {
  DailyBrowserDtos: SynerionDayDTO[];

  LoanedCount: 0;
  TotalCount: 19;
}
export interface SynerionDayDTO {
  EmployeeId: string;
  UniqueId: number;
  Date: string;
  FullName: string;
  Phone: string;
  Mail: string;
  ProfileId: number;
  Contract: string;
  Plant: string;
  Site: string;
  Department: string;
  StandardEntry: string;
  StandardExit: string;
  OnCall: string;
  OnCallValue: string;
  CallIn: string;
  CallInValue: string;
  InOuts: InOut[];
  IsByDuration: boolean;
  Status: number;
  StatusDescriptions: string[];
  StatusJoined: string;
  TotalWage: string;
  AttendanceWage: string;
  TotalAttendance: string;
  TotalOvertime: string;
  Defficiency: string;
  TotalRegularHours: string;
  Profession: string;
  Sort0: string;
  Sort1: string;
  Sort2: string;
  AccumCode: number;
  PeriodKey: number;
  StandardAttendance: string;
  Shift: number;
  TableG: number;
  TableI: number;
  TableN: number;
  AbsenceWage: string;
  AbsenceWageRegular: string;
  AbsenceNoWage: string;
  UnpaidAbsence: string;
  StandardValue: string;
  UpdateCode: string;
  ErrorCode1: string;
  ErrorCode2: string;
  Error1: string;
  Error2: string;
  Error3: string;
  Error4: string;
  Approval1: number;
  Approval2: number;
  Approval3: number;
  BusFare: number;
  Service: number;
  Eshel: number;
  LatePrem: number;
  AbsPrem: number;
  EarlyPrem: number;
  Categories: string[];
  Note: string;
  Attachments: any[];
  ApprovedByManager: boolean;
  ApprovedByEmployee: boolean;
  ApprovedByMiddleLevel: boolean;
  ApprovedByLoggedInUser: boolean;
  HasAudit: boolean;
  HasActiveSalDay: boolean;
  DayType: number;
  DayColor: number;
  ManualStatus: string;
  DayDisplayName: string;
  GeoLocationStatus: number;
  Exceptions: any[];
  AllowEdit: number;
  ReadonlyRecord: ReadonlyRecord;
  PaidAttendance: string;
  IsScheduleEmployee: boolean;
  IsDirectEmployee: boolean;
  Scheduling: any;
  IsLcEmployee: boolean;
  TcVariance: string;
  IsPoolEmployee: boolean;
  DinerType: number;
  IsTcLoanedEmployee: boolean;
  HasAlert: boolean;
  OverTimeValue: string;
  OvertimePermit: number;
  CanEditAttachment: boolean;
  VersionKeyBase64: string;
  OndutyEshel: OndutyEshel;
}

export interface InOut {
  In: In;
  Out: Out;
  Duration: any;
  ReportingCode: ReportingCode;
}

export interface In {
  Time: string;
  AuditIndicatorType: number;
}

export interface Out {
  Time: string;
  AuditIndicatorType: number;
}

export interface ReportingCode {
  Code: string;
  Color: string;
  AuditIndicatorType: number;
}

export interface ReadonlyRecord {
  IsReadonly: boolean;
  ReasonKey: number;
  Reason: any;
}

export interface OndutyEshel {
  AttendanceId: any;
  HotelCost: number;
  UrbanPublicTransport: number;
  InterurbanPublicTransport: number;
  Punches: any[];
}
