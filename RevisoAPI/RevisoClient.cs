using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace RevisoAPI
{
    public class RevisoClient
    {
        private HttpClient _client;

        public RevisoClient(string baseUrl, string appSecretToken, string agreementGrantToken)
        {
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _client.DefaultRequestHeaders.Add("X-AppSecretToken", appSecretToken);
            _client.DefaultRequestHeaders.Add("X-AgreementGrantToken", agreementGrantToken);
            _client.BaseAddress = new Uri(baseUrl);
        }

        public int PageSize { get; set; } = 1000;

        public async Task<RevisoResponseMessage<Agreement>> GetAgreementAsync()
        {
            HttpResponseMessage response = await _client.GetAsync("/self");
            return await CheckResponse(response, () => DeserializeContentAsync<Agreement>(response));
        }

        public async Task<RevisoResponseMessage<Customer>> GetCustomerAsync(int customerNumber)
        {
            HttpResponseMessage response = await _client.GetAsync($"/customers/{customerNumber}");
            return await CheckResponse(response, () => DeserializeContentAsync<Customer>(response));
        }

        public async Task<RevisoReportResponseMessage<ReportEntry>> GetReportBookedEntries(string filter)
        {
            HttpResponseMessage response = await _client.GetAsync($"/report-api/v1/entries/booked?{filter}");
            return await CheckResponse(response, () => DeserializeReportCollectionContentAsync<ReportEntry>(response));
        }

        public async Task<RevisoReportResponseMessage<ReportEntry>> GetReportEntries(string filter)
        {
            HttpResponseMessage response = await _client.GetAsync($"/report-api/v1/entries?{filter}");
            return await CheckResponse(response, () => DeserializeReportCollectionContentAsync<ReportEntry>(response));
        }

        public async Task<RevisoCollectionResponseMessage<NumberSeries>> GetNumberSeries(string filter = null)
        {
            string path = string.IsNullOrWhiteSpace(filter)
               ? $"/number-series?pagesize={PageSize}"
               : $"/number-series?{filter}";

            HttpResponseMessage response = await _client.GetAsync(path);
            return await CheckResponse(response, () => DeserializeCollectionContentAsync<NumberSeries>(response));
        }

        public async Task<RevisoCollectionResponseMessage<Voucher>> GetRegistrazioniContabiliContabilizzateAsync(string filter = null)
        {
            string path = string.IsNullOrWhiteSpace(filter)
                ? $"/vouchers/booked?pagesize={PageSize}"
                : $"/vouchers/booked?{filter}";

            HttpResponseMessage response = await _client.GetAsync(path);
            return await CheckResponse(response, () => DeserializeCollectionContentAsync<Voucher>(response));
        }

        public async Task<RevisoResponseMessage<Supplier>> GetSupplierAsync(int supplierNumber)
        {
            HttpResponseMessage response = await _client.GetAsync($"/suppliers/{supplierNumber}");
            return await CheckResponse(response, () => DeserializeContentAsync<Supplier>(response));
        }

        public async Task<RevisoCollectionResponseMessage<VatAccount>> GetVatAccountsAsync()
        {
            HttpResponseMessage response = await _client.GetAsync($"/vat-accounts?pagesize={PageSize}");
            return await CheckResponse(response, () => DeserializeCollectionContentAsync<VatAccount>(response));
        }

        public async Task<RevisoResponseMessage<VatAccount>> GetVatAccountAsync(string vatCode)
        {
            HttpResponseMessage response = await _client.GetAsync($"/vat-accounts/{vatCode}");
            return await CheckResponse(response, () => DeserializeContentAsync<VatAccount>(response));
        }

        public async Task<bool> QueryIsOkAsync()
        {
            try
            {
                var response = await _client.GetAsync("/echo");
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        private async Task<T> CheckResponse<T>(HttpResponseMessage response, Func<Task<T>> fun)
        {
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return await fun();
            }
            else if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                throw new UnauthorizedAccessException(response.ToString());
            }
            else
            {
                throw new InvalidOperationException(response.ToString());
            }
        }

        private async Task<RevisoReportResponseMessage<T>> DeserializeReportCollectionContentAsync<T>(HttpResponseMessage response)
        {
            string jsonContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<RevisoReportResponseMessage<T>>(jsonContent);
        }

        private async Task<RevisoCollectionResponseMessage<T>> DeserializeCollectionContentAsync<T>(HttpResponseMessage response)
        {
            string jsonContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<RevisoCollectionResponseMessage<T>>(jsonContent);
        }

        private async Task<RevisoResponseMessage<T>> DeserializeContentAsync<T>(HttpResponseMessage response)
        {
            string jsonContent = await response.Content.ReadAsStringAsync();
            var entity = JsonConvert.DeserializeObject<T>(jsonContent);
            return new RevisoResponseMessage<T> { Entity = entity };
        }
    }
}