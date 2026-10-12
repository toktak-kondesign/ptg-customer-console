export interface RequestOtpPayload {
  custId: string;
  callbackData?: string;
}

export interface OtpStatus {
  message: string;
  description: string;
}

export interface RequestOtpData {
  otpId: string;
  referenceCode: string;
  success?: OtpStatus;
}

export interface OtpApiError {
  message: string;
  description: string;
}

export interface RequestOtpResponse {
  success: boolean;
  data?: RequestOtpData;
  error?: string;
}

export interface ResendOtpPayload {
  custId: string;
}

export type ResendOtpResponse = RequestOtpResponse;

export interface VerifyOtpPayload {
  otpId: string;
  referenceCode: string;
  otpCode: string;
}

export interface VerifyOtpData {
  otpId: string;
  result: boolean;
  isErrorCount: boolean;
  isExprCode: boolean;
}

export interface VerifyOtpResponse {
  success: boolean;
  data?: VerifyOtpData;
  error?: string;
}

export interface AuthenXSendOtpPayload {
  custID: string;
}

export interface AuthenXSendOtpResponse {
  success?: boolean;
  isSuccess?: boolean;
  status?: boolean | string | number;
  result?: boolean;
  message?: string;
  description?: string;
  error?: string | OtpApiError;
  otpId?: string;
  OTPId?: string;
  otpid?: string;
  otpID?: string;
  otp_ItemID?: string;
  otpItemID?: string;
  itemID?: string;
  ItemID?: string;
  referenceCode?: string;
  refCode?: string;
  RefCode?: string;
  otpRef?: string;
  OTPRef?: string;
  otp_RefCode?: string;
  otpRefCode?: string;
  data?: {
    otpId?: string;
    OTPId?: string;
    otpid?: string;
    otpID?: string;
    otp_ItemID?: string;
    otpItemID?: string;
    itemID?: string;
    ItemID?: string;
    referenceCode?: string;
    refCode?: string;
    RefCode?: string;
    otpRef?: string;
    OTPRef?: string;
    otp_RefCode?: string;
    otpRefCode?: string;
    message?: string;
  };
}

export interface AuthenXVerifyOtpPayload {
  otp_RefCode: string;
  otp_ItemID: string;
  otp: string;
}

export interface AuthenXVerifyOtpResponse {
  success?: boolean;
  isSuccess?: boolean;
  status?: boolean | string | number;
  result?: boolean;
  message?: string;
  description?: string;
  error?: string | OtpApiError;
  otpId?: string;
  OTPId?: string;
  otp_ItemID?: string;
  isErrorCount?: boolean;
  isExprCode?: boolean;
  isExpired?: boolean;
  data?: {
    success?: boolean;
    isSuccess?: boolean;
    status?: boolean | string | number;
    result?: boolean;
    message?: string;
    isErrorCount?: boolean;
    isExprCode?: boolean;
    isExpired?: boolean;
  };
}
