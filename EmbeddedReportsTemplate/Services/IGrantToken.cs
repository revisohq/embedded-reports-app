namespace EmbeddedReportsTemplate.Services
{
    public interface IGrantToken
    {
        string GetUsable(string inputGrantToken);
    }
}