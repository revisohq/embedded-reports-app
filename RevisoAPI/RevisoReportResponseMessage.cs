using System.Collections.Generic;

namespace RevisoAPI
{
    public class RevisoReportResponseMessage<T>
    {
        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public IEnumerable<T> Lines { get; set; }
    }
}