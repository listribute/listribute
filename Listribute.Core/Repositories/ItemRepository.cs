using System.Linq;
using Listribute.Core.Model;

namespace Listribute.Core.Repositories
{
    internal class ItemRepository : IItemRepository
    {
        private readonly ListributeContext _context;

        public ItemRepository(ListributeContext context)
        {
            _context = context;
        }

    }
}
