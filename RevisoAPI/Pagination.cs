using System;

namespace RevisoAPI
{
    public class Pagination
    {
        public Uri FirstPage { get; set; }

        public Uri LastPage { get; set; }

        public int MaxPageSizeAllowed { get; set; }

        public Uri NextPage { get; set; }

        public int PageSize { get; set; }

        public int Results { get; set; }

        public int ResultsWithoutFilter { get; set; }

        public int SkipPages { get; set; }
    }
}