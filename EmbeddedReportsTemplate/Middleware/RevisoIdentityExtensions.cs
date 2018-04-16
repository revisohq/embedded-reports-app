using System.Security.Principal;

namespace EmbeddedReportsTemplate.Middleware
{
    public static class RevisoIdentityExtensions
    {
        public static RevisoIdentity AsRevisoIdentity(this IIdentity revisoIdentity)
        {
            return revisoIdentity as RevisoIdentity;
        }
    }
}
