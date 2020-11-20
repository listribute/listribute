using System;
using System.Collections.Generic;

namespace Listribute.Core.Model
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImgUrl { get; set; }
        public List List { get; set; }
        public int Order { get; set; }
        public List<User> CheckedBy { get; set; }
        public DateTimeOffset Created { get; set; }
        public User CreatedBy { get; set; }

        public Item(
            string name,
            string description,
            string imgUrl,
            List list,
            int order,
            List<User> checkedBy,
            DateTimeOffset created,
            User createdBy)
        {
            Name = name;
            Description = description;
            ImgUrl = imgUrl;
            List = list;
            Order = order;
            CheckedBy = checkedBy;
            Created = created;
            CreatedBy = createdBy;
        }
    }
}
