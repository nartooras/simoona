using Microsoft.EntityFrameworkCore;

namespace Simoona.Modern.Api.ReadDb;

public sealed class ModernReadDbContext : DbContext
{
    public ModernReadDbContext(DbContextOptions<ModernReadDbContext> options)
        : base(options)
    {
    }

    public DbSet<LegacyUserReadModel> Users => Set<LegacyUserReadModel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<LegacyUserReadModel>(entity =>
        {
            entity.ToTable("AspNetUsers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(128);
            entity.Property(x => x.OrganizationId);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.Property(x => x.UserName).HasMaxLength(256);
        });
    }
}
