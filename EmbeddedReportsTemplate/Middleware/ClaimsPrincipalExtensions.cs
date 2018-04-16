using System.Security.Claims;

namespace EmbeddedReportsTemplate.Middleware
{
    public static class ClaimsPrincipalExtensions
    {
        public static RevisoGrantTokenPrincipal AsGrantTokenPrincipal(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal as RevisoGrantTokenPrincipal;
        }
    }
}