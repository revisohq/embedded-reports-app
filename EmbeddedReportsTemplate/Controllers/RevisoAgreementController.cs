using EmbeddedReportsTemplate.Middleware;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "AuthenticatedUser")]
    public class RevisoAgreementController : Controller
    {
        private ILogger<RevisoAgreementController> _logger;

        public RevisoAgreementController(ILogger<RevisoAgreementController> logger)
        {
            _logger = logger;
        }

        // GET
        [HttpGet]
        public IActionResult Get()
        {
            var telemetry = new TelemetryClient();

            try
            {
                return Ok(ControllerContext.RevisoAgreement());
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogError(ex, nameof(Get));
                telemetry.TrackException(ex);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, nameof(Get));
                telemetry.TrackException(ex);
                return StatusCode(500);
            }
        }
    }
}