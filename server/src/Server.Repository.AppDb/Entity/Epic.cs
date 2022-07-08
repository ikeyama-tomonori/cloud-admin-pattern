namespace Server.Repository.AppDb.Entity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class Epic : TaskBase
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int ProjectId { get; set; }

    public Project? Project { get; set; }

    public List<Backlog>? Backlogs { get; set; }

    public class Configuration : IEntityTypeConfiguration<Epic>
    {
        public void Configure(EntityTypeBuilder<Epic> builder)
        {
            // 代替キー
            builder.HasIndex(epic => new { epic.ProjectId, epic.Title }).IsUnique();

            // 外部参照キー
            builder
                .HasOne(epic => epic.Project)
                .WithMany(project => project.Epics)
                .HasForeignKey(epic => epic.ProjectId)
                .IsRequired();
        }
    }
}
