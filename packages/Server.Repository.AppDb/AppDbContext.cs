namespace Server.Repository.AppDb;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Model.Organization> Organizations => this.Set<Model.Organization>();

    public DbSet<Model.Project> Projects => this.Set<Model.Project>();

    public DbSet<Model.Epic> Epics => this.Set<Model.Epic>();

    public DbSet<Model.Feature> Features => this.Set<Model.Feature>();

    public DbSet<Model.Task> Tasks => this.Set<Model.Task>();
}
