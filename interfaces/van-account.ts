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

export interface VanAccountDtlRow {
  Company: string;
  CustID?: string;
  Name: string;
  ResaleID: string;
  THBranchID: string;
  ProdGroup?: string;
  Description?: string;
  ShipToNum?: string;
  Address1?: string;
  Legalnumber?: string;
  InvoiceAmt: number;
  DocInvoiceAmt: number;
  NetPrice: number;
  Color1: number;
  InvoiceDate: string | null;
  DueDate: string | null;
  DueNew: string | null;
  retroactive: number;
  ODLine: number;
  HeadNum?: string;
  TxtMonth?: string;
  TxtDate?: string;
  xIsPDFFile_c: number;
  WHTCode?: string;
}

export interface VanAccountDtlResponse {
  status: string;
  results: VanAccountDtlRow[];
  error?: string;
}
