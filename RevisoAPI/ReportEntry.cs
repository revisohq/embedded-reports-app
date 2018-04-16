namespace RevisoAPI
{
    public class ReportEntry
    {
        public int AccountNumber { get; set; }

        public decimal Amount { get; set; }

        public decimal AmountForeignCurrency { get; set; }

        public bool Booked { get; set; }

        public string Date { get; set; }

        public string EntryType { get; set; }

        public int EntryTypeId { get; set; }

        public NumberSeriesReference NumberSeries { get; set; }

        public string SplitPaymentType { get; set; }

        public string VatCode { get; set; }

        public bool? VatLine { get; set; }

        public decimal? VatRate { get; set; }

        public string VoucherNumber { get; set; }
    }
}