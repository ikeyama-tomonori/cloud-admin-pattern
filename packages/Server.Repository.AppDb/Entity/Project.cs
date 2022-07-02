namespace Server.Repository.AppDb.Entity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class Project : TaskBase
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public Organization? Organization { get; set; }

    public List<Epic>? Epics { get; set; }

    public class Configuration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            // 代替キー
            builder.HasIndex(project => new { project.Organization, project.Name }).IsUnique();

            // 外部参照キー
            builder
                .HasOne(project => project.Organization)
                .WithMany(organization => organization.Projects);
        }
    }
}
