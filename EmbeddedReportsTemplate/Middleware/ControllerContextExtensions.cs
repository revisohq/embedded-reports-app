using Microsoft.AspNetCore.Mvc;
using RevisoAPI;

namespace EmbeddedReportsTemplate.Middleware
{
    public static class ControllerContextExtensions
    {
        public static Agreement RevisoAgreement(this ControllerContext controllerContext)
        {
            return controllerContext.HttpContext.User.Identity.AsRevisoIdentity().AgreementInfo.Agreement;
        }

        public static int RevisoAgreementNumber(this ControllerContext controllerContext)
        {
            return controllerContext.HttpContext.User.Identity.AsRevisoIdentity().AgreementInfo.AgreementNumber;
        }

        public static string RevisoGrantToken(this ControllerContext controllerContext)
        {
            return controllerContext.HttpContext.User.Identity.AsRevisoIdentity().GrantToken;
        }

    }
}