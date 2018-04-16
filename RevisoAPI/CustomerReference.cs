using System;

namespace RevisoAPI
{
    public class CustomerReference
    {
        public int CustomerNumber { get; set; }

        public string Name { get; set; }

        public Uri Self { get; set; }

        public bool SplitPayment { get; set; }
    }
}