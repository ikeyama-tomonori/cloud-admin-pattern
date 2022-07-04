namespace Server.Repository.AppDb.Entity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class Organization
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public List<Project>? Projects { get; set; }

    public class Configuration : IEntityTypeConfiguration<Organization>
    {
        public void Configure(EntityTypeBuilder<Organization> builder)
        {
            // 代替キー
            builder.HasIndex(organization => organization.Name).IsUnique();
        }
    }
}
