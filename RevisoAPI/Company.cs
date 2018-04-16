using System;

namespace RevisoAPI
{
    public class Company
    {
        public string AddressLine1 { get; set; }

        public int AgreementNumber { get; set; }

        public string City { get; set; }

        public string CompanyIdentificationNumber { get; set; }

        public string Country { get; set; }

        public string CountryCode { get; set; }

        public string Name { get; set; }

        public Uri Self { get; set; }

        public string VatNumber { get; set; }

        public string Zip { get; set; }
    }
}