import { LegalAddressDTO } from "./address";

export interface Company {
  id: number;
  name: string;
  legalAddressDTO: LegalAddressDTO;
  employerVOs?: EmployerVO[];
}

export interface EmployerVO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  role: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  legalAddressDTO: LegalAddressDTO;
  employerVOs?: EmployerVO[];
}

export interface CompanyDropdownItem {
  id: number;
  name: string;
  legalAddressDTO: LegalAddressDTO;
}
