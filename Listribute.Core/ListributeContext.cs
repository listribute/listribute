using System;
using Listribute.Core.Model;
using Microsoft.EntityFrameworkCore;

namespace Listribute.Core
{
    public class ListributeContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<List> Lists { get; set; }
        public DbSet<Item> Items { get; set; }

        #pragma warning disable CS8618
        public ListributeContext(DbContextOptions<ListributeContext> options) : base(options) {}
        #pragma warning restore CS8618
    }
}
