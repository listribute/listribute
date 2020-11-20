using System.Threading.Tasks;
using Listribute.Core.Model;

namespace Listribute.Core.Services
{
    public interface IAuthService
    {
        Task<(bool success, User? user)> TryLogin(string username, string password);
    }
}
