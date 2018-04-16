namespace EmbeddedReportsTemplate.Models
{
    // Semantic Versioning 2.0.0
    //
    // Summary
    //
    // Given a version number MAJOR.MINOR.PATCH, increment the:
    //
    // MAJOR version when you make incompatible APP/API changes,
    // MINOR version when you add functionality in a backwards-compatible manner, and
    // PATCH version when you make backwards-compatible bug fixes.
    public class Version
    {
        public int Major { get; set; }
        public int Minor { get; set; }
        public int Patch { get; set; }
    }
}
