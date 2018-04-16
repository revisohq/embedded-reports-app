using System;

namespace RevisoAPI
{
    public class InvoiceReference
    {
        public int BookedInvoiceNumber { get; set; }

        public DateTime Date { get; set; }

        public Uri Self { get; set; }
    }
}