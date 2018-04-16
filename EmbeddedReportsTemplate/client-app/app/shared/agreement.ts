export interface ICompany {
    addressLine1: string;
    agreementNumber: string;
    city: string;
    companyIdentificationNumber: string;
    country: string;
    countryCode: string;
    name: string;
    self: string;
    vatNumber: string;
    zip: string;
}

export interface IAgreement {
    agreementNumber: number;
    company: ICompany;
}
