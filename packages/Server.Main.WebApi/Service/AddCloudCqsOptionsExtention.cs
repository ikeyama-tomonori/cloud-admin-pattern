namespace Server.Main.WebApi.Service;

public static class AddCloudCqsOptionsExtention
{
    public static IServiceCollection AddCloudCqsOptions(this IServiceCollection services) =>
        services.AddSingleton(typeof(CloudCqsOptions<>));
}
