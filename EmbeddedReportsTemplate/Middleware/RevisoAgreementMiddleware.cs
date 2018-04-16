using EmbeddedReportsTemplate.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Middleware
{
    public class RevisoAgreementMiddleware
    {
        private readonly IAntiforgery _antiforgery;
        private readonly IGrantToken _grantToken;
        private readonly IRevisoRestClientService _revisoRestClientService;
        private readonly RequestDelegate _next;

        public RevisoAgreementMiddleware(
            IAntiforgery antiforgery,
            IGrantToken grantToken,
            IRevisoRestClientService revisoRestClientService,
            RequestDelegate next)
        {
            _antiforgery = antiforgery;
            _grantToken = grantToken;
            _revisoRestClientService = revisoRestClientService;
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var obscuredGrantToken = context.Request.Headers["x-embedded-reports-template-grant-token"].SingleOrDefault();
            if (obscuredGrantToken != null)
            {
                var grantToken = _grantToken.GetUsable(obscuredGrantToken);
                var agreement = await _revisoRestClientService.GetAgreementAsync(grantToken);
                context.User = new ClaimsPrincipal(new RevisoIdentity(true, grantToken, new AgreementInfo(agreement)));
                var tokens = _antiforgery.GetAndStoreTokens(context);
                var cookieOptions = new CookieOptions()
                {
                    HttpOnly = false,
                    SameSite = SameSiteMode.None // Required by chrome to work
                };
                context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, cookieOptions);
            }
            else
            {
                context.User = new ClaimsPrincipal(new RevisoIdentity());
            }
            await _next(context);
        }
    }
}