using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;

namespace EmbeddedReportsTemplate.DataProtection
{
    public class GrantTokenProtection : IGrantTokenProtection
    {
        private static readonly string Purpose = "Reviso.EmbeddedReportsTemplate.GrantToken.v1";
        private readonly IConfiguration _configuration;
        private readonly IDataProtector _cryptoSystem;

        public GrantTokenProtection(IConfiguration configuration, IDataProtectionProvider dataProtectionProvider)
        {
            _configuration = configuration;
            _cryptoSystem = dataProtectionProvider.CreateProtector(Purpose);
        }

        public string GetGrantToken(string grantToken)
        {
            if (!grantToken.Equals("null"))
            {
                return Unprotect(grantToken);
            }
            else
            {
                return _configuration.GetValue<string>("DevelopmentRevisoAgreementGrantToken", string.Empty);
            }
        }

        public string Protect(string token)
        {
            return _cryptoSystem.Protect(token);
        }

        public string Unprotect(string token)
        {
            return _cryptoSystem.Unprotect(token);
        }
    }
}