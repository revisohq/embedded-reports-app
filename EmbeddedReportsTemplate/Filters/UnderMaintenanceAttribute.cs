using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using System;

namespace EmbeddedReportsTemplate.Filters
{
    public class UnderMaintenanceAttribute : Attribute, IResourceFilter
    {
        private IConfiguration _configuration;

        public UnderMaintenanceAttribute(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            if (_configuration.GetValue<bool>("UnderMaintenance")
                && !context.HttpContext.Request.Path.StartsWithSegments(new PathString("/Maintenance")))
            {
                context.Result = new RedirectResult("/Maintenance");
            }
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
        }
    }
}
