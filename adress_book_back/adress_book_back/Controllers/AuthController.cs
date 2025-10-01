using adress_book_back.Interfaces;
using adress_book_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace adress_book_back.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }
        // POST: api/Users/Login

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDataModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _auth.Login(model);
                return Ok(JsonConvert.SerializeObject(result));
            }
            else
            {
                return BadRequest();
            }

        }

        // POST: api/Users/SaveUser-Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SaveUser([FromBody] User user)
        {
            var res = await _auth.Register(user);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}
