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
    public class EntryListController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IRevisoRestClientService _revisoRestClientService;


        public EntryListController(
            IConfiguration configuration,
            IRevisoRestClientService revisoRestClientService
            )
        {
            _configuration = configuration;
            _revisoRestClientService = revisoRestClientService;
        }

        // GET: api/EntryList
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string fromDate, string toDate,
        string numberSeriesPrefixes, string entryTypes, int pageSize)
        {
            string filter = $"fromDate={fromDate}&toDate={toDate}&numberSeriesPrefixes={numberSeriesPrefixes}&entryTypes={entryTypes}&pagesize={pageSize}";
            var response = await _revisoRestClientService.GetEntriesAsync(ControllerContext.RevisoGrantToken(), filter);
            return Ok(response);
        }

        [HttpGet("Booked")]
        public async Task<IActionResult> GetBooked([FromQuery] string fromDate, string toDate,
      string numberSeriesPrefixes, string entryTypes, int pageSize)
        {
            string filter = $"fromDate={fromDate}&toDate={toDate}&numberSeriesPrefixes={numberSeriesPrefixes}&entryTypes={entryTypes}&pagesize={pageSize}";
            var response = await _revisoRestClientService.GetBookedEntriesAsync(ControllerContext.RevisoGrantToken(), filter);
            return Ok(response);
        }
    }
}