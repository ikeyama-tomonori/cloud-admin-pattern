using Microsoft.EntityFrameworkCore;
using Server.EntoryPoint.AppDbMigration;

var factory = new AppDbContextFactory();
var db = factory.CreateDbContext(Array.Empty<string>());
await db.Database.MigrateAsync();
