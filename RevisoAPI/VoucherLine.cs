namespace RevisoAPI
{
    public class VoucherLine
    {
		public AccountReference Account { get; set; }

		public decimal Amount { get; set; }

        public CustomerReference Customer { get; set; }

        public int EntryNumber { get; set; }

        public int InvoiceNumber { get; set; }

        public SupplierReference Supplier { get; set; }

        public bool SystemGeneratedVatLine { get; set; }

        public string Text { get; set; }

        public VatAccountReference VatAccount { get; set; }
	}
}
