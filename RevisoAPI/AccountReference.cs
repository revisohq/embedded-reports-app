using System;

namespace RevisoAPI
{
    public class AccountReference
    {
        public int AccountNumber { get; set; }

        public string AccountType { get; set; }

        public decimal Balance { get; set; }

        public string Name { get; set; }

        public Uri Self { get; set; }
    }
}