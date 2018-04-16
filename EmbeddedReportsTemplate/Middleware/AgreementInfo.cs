using RevisoAPI;

namespace EmbeddedReportsTemplate.Middleware
{
    public class AgreementInfo
    {
        private readonly Agreement _agreement;
        private readonly int _agreementNumber;
        private readonly string _companyName;

        public AgreementInfo(Agreement agreement)
        {
            _agreement = agreement;
            _agreementNumber = agreement.AgreementNumber;
            _companyName = agreement.Company.Name;
        }

        public Agreement Agreement => _agreement;

        public int AgreementNumber => _agreementNumber;

        public string CompanyName => _companyName;
    }
}