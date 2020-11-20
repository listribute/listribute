using System.Linq;
using Listribute.Core.Model;

namespace Listribute.Core.Repositories
{
    internal class ListRepository : IListRepository
    {
        private readonly ListributeContext _context;

        public ListRepository(ListributeContext context)
        {
            _context = context;
        }

    }
}
