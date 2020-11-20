using System;

namespace Listribute.Core.Model
{
    public class PushToken
    {
        public int Id { get; set; }
        public User User { get; set; }
        public string AndroidToken { get; set; }
        public string IosToken { get; set; }
        public DateTimeOffset Created { get; set; }

        public PushToken(
            User user,
            string androidToken,
            string iosToken,
            DateTimeOffset created)
        {
            User = user;
            AndroidToken = androidToken;
            IosToken = iosToken;
            Created = created;
        }
    }
}
