using System;

namespace RevisoAPI
{
    public class VatAccount
    {
        public ExemptVatCodeReference ExemptVatCode { get; set; }

        public string Name { get; set; }

        public decimal RatePercentage { get; set; }

        public Uri Self { get; set; }

        public string VatCode { get; set; }

        public VatType VatType { get; set; }
    }
}