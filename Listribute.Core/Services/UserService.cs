using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Listribute.Core.Model;
using Listribute.Core.Repositories;

namespace Listribute.Core.Services
{
    public class UserService : IUserService
    {
        private const int OFFSET = 1337;

        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string[]> GetAllUsernames()
        {
            var users = await _userRepository.GetAll();
            return users.Select(u => u.Username).ToArray();
        }

        public async Task<User> CreateNewUser()
        {
            var numUsersInDb = await _userRepository.Count();
            var username = $"listribute_{OFFSET + numUsersInDb}";
            var password = GeneratePassword();
            var user = new User(username, password, null, true,
                new System.Collections.Generic.List<List>(),
                new System.Collections.Generic.List<PushToken>(),
                DateTimeOffset.Now);

            await _userRepository.AddUser(user);
            return user;
        }

        private string GeneratePassword(int length = 12)
        {
            var numBytes = (int)Math.Ceiling((double)length / 2);
            var bytes = new byte[numBytes];
            using var rng = new RNGCryptoServiceProvider();
            rng.GetBytes(bytes);
            var pass = string.Join("", bytes.Select(b => $"{b:x2}"));
            if (length % 2 != 0)
                pass = pass.Substring(1);
            return pass;
        }

        public async Task<bool> IsUsernameAvailable(string username)
        {
            var user = await _userRepository.GetByUsername(username);
            return user == null;
        }
    }
}
