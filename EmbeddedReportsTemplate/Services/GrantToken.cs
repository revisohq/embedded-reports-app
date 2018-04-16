using EmbeddedReportsTemplate.DataProtection;
using Microsoft.Extensions.Configuration;

namespace EmbeddedReportsTemplate.Services
{
    public class GrantToken : IGrantToken
    {
        private IConfiguration _configuration;
        private IGrantTokenProtection _grantTokenProtection;

        public GrantToken(
            IConfiguration configuration,
            IGrantTokenProtection grantTokenProtection)
        {
            _configuration = configuration;
            _grantTokenProtection = grantTokenProtection;
        }

        public string GetUsable(string inputGrantToken)
        {
            if (!inputGrantToken.Equals("null"))
            {
                return _grantTokenProtection.Unprotect(inputGrantToken);
            }
            else
            {
                return _configuration.GetValue<string>("DevelopmentRevisoAgreementGrantToken", string.Empty);
            }
        }
    }
}