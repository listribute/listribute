using System.Threading.Tasks;
using Listribute.Core.Model;

namespace Listribute.Core.Repositories
{
    public interface IUserRepository
    {
        Task<User[]> GetAll();
        Task<User?> GetByUsername(string username);
        Task<User?> GetByUsernameAndPassword(string username, string password);
        Task<int> Count();
        Task AddUser(User user);
    }
}
