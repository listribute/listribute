using System.Threading.Tasks;
using Listribute.Core.Model;

namespace Listribute.Core.Services
{
    public interface IUserService
    {
        Task<string[]> GetAllUsernames();
        Task<User> CreateNewUser();
        Task<bool> IsUsernameAvailable(string username);
    }
}
