using Backend_LNT_BOOST.Dtos.AuthDto;
using Backend_LNT_BOOST.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend_LNT_BOOST.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var response = await _authService.LoginAsync(loginRequest);
            if(response == null)
            {
                return Unauthorized(new { message = "Username or Password is wrong, please check again or contact to ADMIN" });
            }
            return Ok(response);
        }

    }
}
