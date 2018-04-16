namespace EmbeddedReportsTemplate.DataProtection
{
    public interface IGrantTokenProtection
    {
        string GetGrantToken(string grantToken);

        string Protect(string token);

        string Unprotect(string token);
    }
}
