namespace Server.Repository.AppDb.Entity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class Backlog : TaskBase
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int EpicId { get; set; }

    public Epic? Epic { get; set; }

    public List<BacklogTask>? BacklogTasks { get; set; }

    public class Configuration : IEntityTypeConfiguration<Backlog>
    {
        public void Configure(EntityTypeBuilder<Backlog> builder)
        {
            // 代替キー
            builder.HasIndex(backlog => new { backlog.EpicId, backlog.Title }).IsUnique();

            // 外部参照キー
            builder
                .HasOne(backlog => backlog.Epic)
                .WithMany(epic => epic.Backlogs)
                .HasForeignKey(backlog => backlog.EpicId)
                .IsRequired();
        }
    }
}
