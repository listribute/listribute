using System;
using System.Linq;
using System.Security.Cryptography;
using Listribute.Core.Model;
using Listribute.Core.Repositories;

namespace Listribute.Core.Services
{
    public class ListService : IListService
    {
        private readonly IListRepository _listRepository;

        public ListService(IListRepository listRepository)
        {
            _listRepository = listRepository;
        }

    }
}
