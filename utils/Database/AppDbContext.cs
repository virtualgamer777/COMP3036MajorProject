using Microsoft.EntityFrameworkCore;

namespace Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Data.Listing> Listings { get; set; }
    public DbSet<Data.User> Users { get; set; }
}