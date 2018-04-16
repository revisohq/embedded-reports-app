using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using EmbeddedReportsTemplate.Middleware;
using EmbeddedReportsTemplate.Services;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "AuthenticatedUser")]
    public class NumberSeriesController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IRevisoRestClientService _revisoRestClientService;

        public NumberSeriesController(
             IConfiguration configuration,
            IRevisoRestClientService revisoRestClientService)
        {
            _configuration = configuration;
            _revisoRestClientService = revisoRestClientService;
        }

        // GET: api/NumberSeries
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            string filter = "filter=entryType$eq:financeVoucher&pagesize=1000";
            var response = await _revisoRestClientService.GetNumberSeriesAsync(ControllerContext.RevisoGrantToken(), filter);

            return Ok(response);
        }
    }
}
