using EmbeddedReportsTemplate.DataProtection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Middleware
{
    public class RevisoAuthenticationHandler : AuthenticationHandler<RevisoAuthenticationSchemeOptions>
    {
        public const string REVISO_AUTHENTICATION_SCHEME = "Reviso authentication";
        private readonly IConfiguration _configuration;
        private readonly IGrantTokenProtection _grantTokenProtection;

        public RevisoAuthenticationHandler(IConfiguration configuration, IGrantTokenProtection grantTokenProtection, IOptionsMonitor<RevisoAuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
            _configuration = configuration;
            _grantTokenProtection = grantTokenProtection;
        }

        protected async override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var embeddedAppToken = Context.GetRouteValue("embeddedAppToken") as string;
            if (embeddedAppToken?.Equals("null") == true)
            {
                var developmentGrantToken = _configuration.GetValue<string>("DevelopmentRevisoAgreementGrantToken", string.Empty);
                if (String.IsNullOrEmpty(developmentGrantToken))
                {
                    return AuthenticateResult.Fail(new UnauthorizedAccessException());
                }
                else
                {
                    return AuthenticateResult.Success(new AuthenticationTicket(new RevisoGrantTokenPrincipal("null"), REVISO_AUTHENTICATION_SCHEME));
                }
            }
            else
            {
                var restClient = new HttpClient();
                restClient.DefaultRequestHeaders.Accept.Clear();
                restClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                restClient.DefaultRequestHeaders.Add("X-AppSecretToken", _configuration["RevisoAppSecretToken"]);
                var responseMessage = await restClient.GetAsync($"{_configuration["RevisoRestUrl"]}/apps-auth/grant-token/{embeddedAppToken}");
                if (responseMessage.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return AuthenticateResult.Fail(new UnauthorizedAccessException());
                }
                else if (responseMessage.StatusCode == HttpStatusCode.OK)
                {
                    var token = _grantTokenProtection.Protect(await responseMessage.Content.ReadAsStringAsync());
                    return AuthenticateResult.Success(new AuthenticationTicket(new RevisoGrantTokenPrincipal(token), REVISO_AUTHENTICATION_SCHEME));
                }
                else
                {
                    return AuthenticateResult.Fail(new InvalidOperationException(responseMessage.ToString()));
                }
            }
        }

    }
}