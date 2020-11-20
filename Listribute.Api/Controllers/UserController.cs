using System;
using System.Threading.Tasks;
using Listribute.Api.Dtos;
using Listribute.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace Listribute.Api.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Route("users")]
        public async Task<string[]> GetAllUsernames()
        {
            var usernames = await _userService.GetAllUsernames();
            return usernames;
        }

        [HttpGet]
        [Route("test/{username}")]
        public async Task<IActionResult> IsUsernameAvailable(string username)
        {
            return await _userService.IsUsernameAvailable(username)
                ? Ok()
                : Conflict();
        }

        [HttpPost]
        public async Task<CreateUserResponse> CreateNew()
        {
            var user = await _userService.CreateNewUser();
            return new CreateUserResponse
            {
                Username = user.Username
            };
        }

        [HttpPost]
        [Route("token/android/{token}")]
        public void AddAndroidToken(string token)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("token/ios/{token}")]
        public void AddIosToken(string token)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("{username}/sendpassword")]
        public void SendPassword(string username)
        {
            throw new NotImplementedException();
        }
    }
}
