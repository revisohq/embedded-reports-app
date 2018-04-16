using System;

namespace RevisoAPI
{
    public class VatType
    {
        public string Name { get; set; }

        public Uri Self { get; set; }

        public VatTypeEnum VatTypeNumber { get; set; }
    }
}