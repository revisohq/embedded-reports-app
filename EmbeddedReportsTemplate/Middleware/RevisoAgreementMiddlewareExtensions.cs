using Microsoft.AspNetCore.Builder;

namespace EmbeddedReportsTemplate.Middleware
{
    public static class RevisoAgreementMiddlewareExtensions
    {
        public static IApplicationBuilder UseRevisoAgreement(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RevisoAgreementMiddleware>();
        }
    }
}