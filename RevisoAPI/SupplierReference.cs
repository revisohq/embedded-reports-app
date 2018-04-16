using System;

namespace RevisoAPI
{
    public class SupplierReference
    {
        public string Name { get; set; }
        public Uri Self { get; set; }

        public int SupplierNumber { get; set; }
    }
}