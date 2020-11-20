using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Listribute.Api.Dtos;
using Listribute.Core.Model;
using Listribute.Core.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Listribute.Api.Controllers
{
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<User> LogIn(LoginRequest req)
        {
            if (req.Username == null || req.Password == null)
                throw new ArgumentException("Missing username and/or password");

            var (success, user) = await _authService.TryLogin(req.Username, req.Password);

            if (!success || user == null)
                throw new ArgumentException("Invalid username and/or password");

            var claims = new []
            {
                new Claim(ClaimTypes.Name, user.Username)
            };

            var claimsIdentity = new ClaimsIdentity(claims);

            await HttpContext.SignInAsync(new ClaimsPrincipal(claimsIdentity));

            return user;
        }

        public async Task LogOut()
        {
            await HttpContext.SignOutAsync();
        }
    }
}
