using System;

namespace RevisoAPI
{
    public class Customer
    {
        public string Address { get; set; }

        public string City { get; set; }

        public string CorporateIdentificationNumber { get; set; }

        public CountryCode CountryCode { get; set; }

        public int CustomerNumber { get; set; }

        public string Name { get; set; }

        public Uri Self { get; set; }

        public bool SplitPayment { get; set; }

        public string VatNumber { get; set; }

        public VatZoneReference VatZone { get; set; }

        public string Zip { get; set; }
    }
}