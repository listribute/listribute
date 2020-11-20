using System;
using System.Linq;
using System.Security.Cryptography;
using Listribute.Core.Model;
using Listribute.Core.Repositories;

namespace Listribute.Core.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

    }
}
