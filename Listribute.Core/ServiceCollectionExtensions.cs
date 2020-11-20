using System;
using Listribute.Core.Repositories;
using Listribute.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Listribute.Core
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddListributeServices(this IServiceCollection services, string dbFileName = "listribute.db")
        {
            services.AddDbContext<ListributeContext>(options =>
            {
                options.UseSqlite($"Data Source={dbFileName}");
            });

            services.AddSingleton<IAuthService, AuthService>();

            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddSingleton<IUserService, UserService>();

            services.AddSingleton<IListRepository, ListRepository>();
            services.AddSingleton<IListService, ListService>();

            services.AddSingleton<IItemRepository, ItemRepository>();
            services.AddSingleton<IItemService, ItemService>();

            return services;
        }
    }
}
