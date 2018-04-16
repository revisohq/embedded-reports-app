using System;
using System.Collections.Generic;

namespace RevisoAPI
{
    public class Voucher
    {
        public DateTime Date { get; set; }

        public InvoiceReference Invoice { get; set; }

        public IEnumerable<VoucherLine> Lines { get; set; }

        public NumberSeries NumberSeries { get; set; }

        public decimal Remainder { get; set; }

        public Uri Self { get; set; }

        public int VoucherId { get; set; }

        public VoucherNumberData VoucherNumber { get; set; }

        public string VoucherType { get; set; }
    }
}