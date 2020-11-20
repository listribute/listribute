using System;
using System.Threading.Tasks;
using Listribute.Core.Model;
using Listribute.Core.Repositories;

namespace Listribute.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<(bool success, User? user)> TryLogin(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAndPassword(username, password);
            return (user != null, user);
        }
    }
}
