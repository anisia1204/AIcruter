export interface Company {
  id: string;
  legalAddress: unknown; // address
  legalDetails: unknown;
  displayName: string;
  avatar: string; // maybe for simplicity just generate an avatar with the first letter of the displayName as avatar
}
