using Microsoft.EntityFrameworkCore;

namespace Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Data.User> Users => Set<Data.User>();
    public DbSet<Data.Listing> Listings => Set<Data.Listing>();
    public DbSet<Data.UserPurchase> UserPurchases => Set<Data.UserPurchase>();
    public DbSet<Data.CartItem> CartItems => Set<Data.CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Data.User>()
            .HasKey(u => u.ID);

        modelBuilder.Entity<Data.Listing>()
            .HasKey(l => l.ID);

        modelBuilder.Entity<Data.UserPurchase>()
            .HasKey(p => p.PurchaseID);

        modelBuilder.Entity<Data.UserPurchase>()
            .HasOne<Data.User>()
            .WithMany()
            .HasForeignKey(p => p.UserID);

        modelBuilder.Entity<Data.UserPurchase>()
            .HasOne<Data.Listing>()
            .WithMany()
            .HasForeignKey(p => p.ProductID);

        modelBuilder.Entity<Data.User>()
            .Ignore(u => u.products);
        
        modelBuilder.Entity<Data.CartItem>()
            .HasKey(c => new { c.UserId, c.ListingId });

        modelBuilder.Entity<Data.CartItem>()
            .HasOne<Data.User>()
            .WithMany()
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<Data.CartItem>()
            .HasOne<Data.Listing>()
            .WithMany()
            .HasForeignKey(c => c.ListingId);
    }
}