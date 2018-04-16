using System.Security.Claims;

namespace EmbeddedReportsTemplate.Middleware
{
    public class RevisoGrantTokenPrincipal : ClaimsPrincipal
    {
        private readonly string _grantToken;

        public RevisoGrantTokenPrincipal(string grantToken)
        {
            _grantToken = grantToken;
        }

        public string GrantToken => _grantToken;
    }
}