using System.Security.Claims;

namespace EmbeddedReportsTemplate.Middleware
{
    public class RevisoIdentity : ClaimsIdentity
    {
        private readonly AgreementInfo _agreement;
        private readonly string _grantToken;
        private readonly bool _isAuthenticated;

        public RevisoIdentity()
            : this(false, null, null)
        {
        }

        public RevisoIdentity(bool isAuthenticated, string grantToken, AgreementInfo agreement)
        {
            _isAuthenticated = isAuthenticated;
            _grantToken = grantToken;
            _agreement = agreement;
        }

        public AgreementInfo AgreementInfo => _agreement;

        public override string AuthenticationType => RevisoAuthenticationHandler.REVISO_AUTHENTICATION_SCHEME;

        public string GrantToken => _grantToken;

        public override bool IsAuthenticated => _isAuthenticated;

        public override string Name => _agreement?.AgreementNumber.ToString();
    }
}