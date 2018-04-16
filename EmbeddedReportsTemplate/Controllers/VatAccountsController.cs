using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using EmbeddedReportsTemplate.Middleware;
using EmbeddedReportsTemplate.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "AuthenticatedUser")]
    public class VatAccountsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IRevisoRestClientService _revisoRestClientService;

        public VatAccountsController(
             IConfiguration configuration,
            IRevisoRestClientService revisoRestClientService)
        {
            _configuration = configuration;
            _revisoRestClientService = revisoRestClientService;
        }

        // GET: api/VatAccounts
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _revisoRestClientService.GetVatAccountsAsync(ControllerContext.RevisoGrantToken());
            return Ok(response);
        }
    }
}