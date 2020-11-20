using System;
using System.Collections.Generic;

namespace Listribute.Core.Model
{
    public class List
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool WishList { get; set; }
        public List<Item> Items { get; set; }
        public List<User> Subscribers { get; set; }
        public DateTimeOffset Created { get; set; }
        public User CreatedBy { get; set; }

        public List(
            string name,
            bool wishList,
            List<Item> items,
            List<User> subscribers,
            DateTimeOffset created,
            User createdBy)
        {
            Name = name;
            WishList = wishList;
            Items = items;
            Subscribers = subscribers;
            Created = created;
            CreatedBy = createdBy;
        }
    }
}
