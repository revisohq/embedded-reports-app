using Microsoft.Extensions.Configuration;
using RevisoAPI;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Services
{
    public class RevisoRestClientService : IRevisoRestClientService
    {
        private IConfiguration _configuration;

        public RevisoRestClientService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Agreement> GetAgreementAsync(string grantToken)
        {
            var revisoClient = new RevisoClient(
                _configuration["RevisoRestUrl"],
                _configuration["RevisoAppSecretToken"],
                grantToken);
            return (await revisoClient.GetAgreementAsync()).Entity;
        }

        public async Task<int> GetAgreementNumberAsync(string grantToken)
        {
            return (await GetAgreementAsync(grantToken)).AgreementNumber;
        }

         public async Task<RevisoReportResponseMessage<ReportEntry>> GetBookedEntriesAsync(string grantToken, string filter)
        {
            var revisoClient = new RevisoClient(
             _configuration["RevisoRestUrl"],
             _configuration["RevisoAppSecretToken"],
             grantToken);

            return await revisoClient.GetReportBookedEntries(filter);
        }

        public async Task<RevisoReportResponseMessage<ReportEntry>> GetEntriesAsync(string grantToken, string filter)
        {
            var revisoClient = new RevisoClient(
             _configuration["RevisoRestUrl"],
             _configuration["RevisoAppSecretToken"],
             grantToken);

            return await revisoClient.GetReportEntries(filter);
        }

        public async Task<RevisoCollectionResponseMessage<NumberSeries>> GetNumberSeriesAsync(string grantToken, string filter)
        {
            var revisoClient = new RevisoClient(
              _configuration["RevisoRestUrl"],
              _configuration["RevisoAppSecretToken"],
              grantToken);
            return await revisoClient.GetNumberSeries(filter);
        }

        public async Task<RevisoCollectionResponseMessage<VatAccount>> GetVatAccountsAsync(string grantToken)
        {
            var revisoClient = new RevisoClient(
               _configuration["RevisoRestUrl"],
               _configuration["RevisoAppSecretToken"],
               grantToken);
            return await revisoClient.GetVatAccountsAsync();
        }
    }
}