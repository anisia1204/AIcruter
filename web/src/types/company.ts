import { LegalAddressDTO } from "./address";

export interface Company {
  id: number;
  name: string;
  legalAddressDTO: LegalAddressDTO;
}
