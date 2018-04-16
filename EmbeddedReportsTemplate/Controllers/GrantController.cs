using EmbeddedReportsTemplate.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class GrantController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public GrantController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        // GET api/grant/abc123
        [HttpGet("{embeddedAppToken=null}")]
        public async Task<IActionResult> Get()
        {
            var result = await _authenticationService.AuthenticateAsync(HttpContext, RevisoAuthenticationHandler.REVISO_AUTHENTICATION_SCHEME);
            if (result.Succeeded)
            {
                return Ok(result.Ticket.Principal.AsGrantTokenPrincipal().GrantToken);
            }
            else
            {
                if (result.Failure is UnauthorizedAccessException)
                {
                    return Unauthorized();
                }
                else
                {
                    return StatusCode(500);
                }
            }
        }
    }
}