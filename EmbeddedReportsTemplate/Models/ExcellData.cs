using System.Collections.Generic;

namespace EmbeddedReportsTemplate.Models
{
    public class ExcellData
    {
        public Agreement Agreement { get; set; }
        public IEnumerable<SummaryRow> FinalSummary { get; set; }
        public SummaryTotals FinalSummaryTotals { get; set; }
        public IEnumerable<NumberSeries> NumberSeries { get; set; }
        public IEnumerable<Page> Pages { get; set; }
        public string Period { get; set; }
        public int Year { get; set; }
    }

    public class Page
    {
        public string NumberSeriesName { get; set; }
        public string NumberSeriesPrefix { get; set; }
        public IEnumerable<PageRow> Rows { get; set; }
        public IEnumerable<SummaryRow> Summary { get; set; }
        public decimal? SummaryAmount { get; set; }
        public decimal? SummaryVat { get; set; }
        public decimal? SummaryTotal { get; set; }

    }

    public class PageRow
    {
        public decimal? Amount { get; set; }
        public decimal? DailyTotal { get; set; }
        public string Day { get; set; }
        public string Description { get; set; }
        public decimal? RatePercentage { get; set; }
        public decimal? Total { get; set; }
        public decimal? Vat { get; set; }
        public string VatCode { get; set; }
        public string VatDescription { get; set; }
    }

    public class SummaryRow
    {
        public decimal? Amount { get; set; }
        public decimal? RatePercentage { get; set; }
        public decimal? Total { get; set; }
        public decimal? Vat { get; set; }
        public string VatCode { get; set; }
        public string VatDescription { get; set; }
    }

    public class SummaryTotals
    {
        public decimal? Amount { get; set; }
        public decimal? Vat { get; set; }
        public decimal? Total { get; set; }
    }
}