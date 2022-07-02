﻿namespace Server.Repository.AppDb;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Entity.Organization> Organizations => this.Set<Entity.Organization>();
    public DbSet<Entity.Project> Projects => this.Set<Entity.Project>();
    public DbSet<Entity.Epic> Epics => this.Set<Entity.Epic>();
    public DbSet<Entity.Backlog> Backlogs => this.Set<Entity.Backlog>();
    public DbSet<Entity.BacklogTask> BacklogTasks => this.Set<Entity.BacklogTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new Entity.Organization.Configuration());
        modelBuilder.ApplyConfiguration(new Entity.Project.Configuration());
        modelBuilder.ApplyConfiguration(new Entity.Epic.Configuration());
        modelBuilder.ApplyConfiguration(new Entity.Backlog.Configuration());
        modelBuilder.ApplyConfiguration(new Entity.BacklogTask.Configuration());
    }
}
