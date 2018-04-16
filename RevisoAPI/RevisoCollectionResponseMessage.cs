using System;
using System.Collections.Generic;

namespace RevisoAPI
{
    public class RevisoCollectionResponseMessage<T>
    {
        public IEnumerable<T> Collection { get; set; }

        public Pagination Pagination { get; set; }

        public Uri Self { get; set; }
    }
}