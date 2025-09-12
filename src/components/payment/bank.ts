import { BankType, FintechCategory } from "./enums";

// Bank interface
export interface Bank {
  name: string;
  code: string;
  type: BankType;
  fintechCategory?: FintechCategory; // Only for fintech companies
}

// Union type for all bank codes
export type BankCode = 
  | 'ICIC' | 'HDFC' | 'UTIB' | 'SBIN' | 'HSBC' | 'ALLA' | 'ANDBA' 
  | 'AUBL' | 'BARB' | 'BKID' | 'MAHB' | 'CNRB' | 'CITI' | 'CIUB' 
  | 'CORP' | 'DCBL' | 'BKDN' | 'ESFB' | 'FDRL' | 'IBKL' | 'IDFB' 
  | 'IDIB' | 'IOBA' | 'INDB' | 'JUPITER' | 'KARB' | 'KVBL' | 'KKB' 
  | 'NIYO' | 'ONECARD' | 'PUNB' | 'RAZORPAYX' | 'RATN' | 'STCB' 
  | 'SLICE' | 'SIBL' | 'SCBL' | 'SBMY' | 'SYNB' | 'UBIN' | 'VIJB' | 'YESB';

// Complete bank data array type
export type BankData = Bank[];

// Example implementation with the actual data
export const BANKS: BankData = [
  // Public Sector Banks
  { name: 'ICICI Bank', code: 'ICIC', type: BankType.PRIVATE_SECTOR },
  { name: 'HDFC Bank', code: 'HDFC', type: BankType.PRIVATE_SECTOR },
  { name: 'Axis Bank', code: 'UTIB', type: BankType.PRIVATE_SECTOR },
  { name: 'State Bank of India', code: 'SBIN', type: BankType.PUBLIC_SECTOR },
  { name: 'Hongkong & Shanghai Banking Corporation', code: 'HSBC', type: BankType.FOREIGN },
  { name: 'Allahabad Bank', code: 'ALLA', type: BankType.PUBLIC_SECTOR },
  { name: 'Andhra Bank', code: 'ANDBA', type: BankType.PUBLIC_SECTOR },
  { name: 'AU Small Finance Bank', code: 'AUBL', type: BankType.SMALL_FINANCE },
  { name: 'Bank of Baroda', code: 'BARB', type: BankType.PUBLIC_SECTOR },
  { name: 'Bank of India', code: 'BKID', type: BankType.PUBLIC_SECTOR },
  { name: 'Bank of Maharashtra', code: 'MAHB', type: BankType.PUBLIC_SECTOR },
  { name: 'Canara Bank', code: 'CNRB', type: BankType.PUBLIC_SECTOR },
  { name: 'CITI Bank', code: 'CITI', type: BankType.FOREIGN },
  { name: 'City Union Bank', code: 'CIUB', type: BankType.PRIVATE_SECTOR },
  { name: 'Corporation Bank', code: 'CORP', type: BankType.PUBLIC_SECTOR },
  { name: 'DCB Bank', code: 'DCBL', type: BankType.PRIVATE_SECTOR },
  { name: 'Dena Bank', code: 'BKDN', type: BankType.PUBLIC_SECTOR },
  { name: 'Equitas Small Finance Bank', code: 'ESFB', type: BankType.SMALL_FINANCE },
  { name: 'Federal Bank', code: 'FDRL', type: BankType.PRIVATE_SECTOR },
  { name: 'IDBI', code: 'IBKL', type: BankType.REGIONAL_COOPERATIVE },
  { name: 'IDFC FIRST Bank', code: 'IDFB', type: BankType.PRIVATE_SECTOR },
  { name: 'Indian Bank', code: 'IDIB', type: BankType.PUBLIC_SECTOR },
  { name: 'Indian Overseas Bank', code: 'IOBA', type: BankType.PUBLIC_SECTOR },
  { name: 'IndusInd Bank', code: 'INDB', type: BankType.PRIVATE_SECTOR },
  { name: 'Jupiter', code: 'JUPITER', type: BankType.FINTECH, fintechCategory: FintechCategory.DIGITAL_BANKING },
  { name: 'Karnataka Bank', code: 'KARB', type: BankType.PRIVATE_SECTOR },
  { name: 'Karur Vysya Bank', code: 'KVBL', type: BankType.PRIVATE_SECTOR },
  { name: 'Kotak Mahindra Bank', code: 'KKB', type: BankType.PRIVATE_SECTOR },
  { name: 'Niyo Global Cards', code: 'NIYO', type: BankType.FINTECH, fintechCategory: FintechCategory.PAYMENT_CARDS },
  { name: 'One Card', code: 'ONECARD', type: BankType.FINTECH, fintechCategory: FintechCategory.PAYMENT_CARDS },
  { name: 'Punjab National Bank', code: 'PUNB', type: BankType.PUBLIC_SECTOR },
  { name: 'RazorpayX Corporate Cards', code: 'RAZORPAYX', type: BankType.FINTECH, fintechCategory: FintechCategory.CORPORATE_PAYMENTS },
  { name: 'RBL Bank', code: 'RATN', type: BankType.PRIVATE_SECTOR },
  { name: 'SBM Bank', code: 'STCB', type: BankType.FOREIGN },
  { name: 'Slice', code: 'SLICE', type: BankType.FINTECH, fintechCategory: FintechCategory.PAYMENT_CARDS },
  { name: 'South Indian Bank', code: 'SIBL', type: BankType.PRIVATE_SECTOR },
  { name: 'Standard Chartered Bank', code: 'SCBL', type: BankType.FOREIGN },
  { name: 'State Bank of Mysore', code: 'SBMY', type: BankType.REGIONAL_COOPERATIVE },
  { name: 'Syndicate Bank', code: 'SYNB', type: BankType.PUBLIC_SECTOR },
  { name: 'Union Bank of India', code: 'UBIN', type: BankType.PUBLIC_SECTOR },
  { name: 'Vijaya Bank', code: 'VIJB', type: BankType.PUBLIC_SECTOR },
  { name: 'Yes Bank', code: 'YESB', type: BankType.PRIVATE_SECTOR }
];

// Utility types for filtering
export type PublicSectorBank = Bank & { type: BankType.PUBLIC_SECTOR };
export type PrivateSectorBank = Bank & { type: BankType.PRIVATE_SECTOR };
export type ForeignBank = Bank & { type: BankType.FOREIGN };
export type SmallFinanceBank = Bank & { type: BankType.SMALL_FINANCE };
export type FintechCompany = Bank & { type: BankType.FINTECH; fintechCategory: FintechCategory };
 
