using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "AuthenticatedUser")]
    public class ExportCorrispettiviToPdfController : Controller
    {
        // POST: api/ExportCorrispettiviToPdf
        [HttpPost]
        public async Task<IActionResult> Post([FromServices] INodeServices nodeServices, [FromBody] dynamic content)
        {
            string htmlContent = content.html;
            string footer = content.footer;

            var result = await nodeServices.InvokeAsync<byte[]>("./PdfGenerator", htmlContent, footer);

            return File(result, "application/pdf");
        }
    }
}
