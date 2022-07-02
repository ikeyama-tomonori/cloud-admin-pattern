namespace Server.Repository.AppDb.Entity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BacklogTask : TaskBase
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public Backlog? Feature { get; set; }

    public class Configuration : IEntityTypeConfiguration<BacklogTask>
    {
        public void Configure(EntityTypeBuilder<BacklogTask> builder)
        {
            // 代替キー
            builder
                .HasIndex(backlogTask => new { backlogTask.Feature, backlogTask.Title })
                .IsUnique();

            // 外部参照キー
            builder
                .HasOne(backlogTask => backlogTask.Feature)
                .WithMany(feature => feature.BacklogTasks);
        }
    }
}
