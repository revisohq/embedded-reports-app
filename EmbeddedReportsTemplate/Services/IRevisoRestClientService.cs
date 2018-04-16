using RevisoAPI;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Services
{
    public interface IRevisoRestClientService
    {
        Task<Agreement> GetAgreementAsync(string grantToken);

        Task<int> GetAgreementNumberAsync(string grantToken);

        Task<RevisoCollectionResponseMessage<NumberSeries>> GetNumberSeriesAsync(string grantToken, string filter);

        Task<RevisoCollectionResponseMessage<VatAccount>> GetVatAccountsAsync(string grantToken);

        Task<RevisoReportResponseMessage<ReportEntry>> GetBookedEntriesAsync(string grantToken, string filter);
        
        Task<RevisoReportResponseMessage<ReportEntry>> GetEntriesAsync(string grantToken, string filter);
    }
}