using System.Linq;
using System.Threading.Tasks;
using Listribute.Core.Model;
using Microsoft.EntityFrameworkCore;

namespace Listribute.Core.Repositories
{
    internal class UserRepository : IUserRepository
    {
        private readonly ListributeContext _context;

        public UserRepository(ListributeContext context)
        {
            _context = context;
        }

        public Task<User[]> GetAll()
        {
            return _context.Users.ToArrayAsync();
        }

        public async Task<User?> GetByUsername(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return user;
        }

        public async Task<User?> GetByUsernameAndPassword(string username, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
            return user;
        }

        public Task<int> Count()
        {
            return _context.Users.CountAsync();
        }

        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}
