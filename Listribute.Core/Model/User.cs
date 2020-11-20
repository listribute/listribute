using System;

namespace Listribute.Core.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public bool PushNotifications { get; set; }
        public System.Collections.Generic.List<List> Lists { get; set; }
        public System.Collections.Generic.List<PushToken> PushTokens { get; set; }
        public DateTimeOffset Created { get; set; }

        public User(
            string username,
            string password,
            string? email,
            bool pushNotifications,
            System.Collections.Generic.List<List> lists,
            System.Collections.Generic.List<PushToken> pushTokens,
            DateTimeOffset created)
        {
            Username = username;
            Password = password;
            Email = email;
            PushNotifications = pushNotifications;
            Lists = lists;
            PushTokens = pushTokens;
            Created = created;
        }
    }
}
