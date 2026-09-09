export interface VanBranch {
  Company: string;
  ResaleID: string;
  THBranchID: string;
}

export interface VanCustomer extends VanBranch {
  CustID: string;
  CustNum: number;
  Name: string;
  xFullName_c: string;
  Address1: string;
  Address2: string;
  Address3: string;
  City: string;
  State: string;
  Zip: string;
  PhoneNum: string;
  FaxNum: string;
  xIsActive_c: boolean;
  CreditCompany: string;
  xRefCustomer_c: string;
  NumCardID: string;
  DocInvoiceAmt: number;
  ResaleIDX: string;
  LastDate: string | null;
}

export interface VanAccount extends VanBranch {
  CustID: string;
  CustNum: number;
  Name: string;
  xFullName_c: string;
  xIsActive_c: boolean;
  VANNO: string;
  CreditDesc: string;
  CreditLemit: number;
  DocInvoiceAmt: number;
  DocInvoiceBal: number;
  iColor1: number;
  StatusCredit: string;
  StartDate: string | null;
  EndDate: string | null;
  CreditCompany: string;
  IsShow: number;
}

export interface VanAccountDetails {
  branches: VanBranch[];
  customer: VanCustomer | null;
  accounts: VanAccount[];
}

export interface VanAccountResponse {
  status: string;
  results: VanAccountDetails;
  error?: string;
}
