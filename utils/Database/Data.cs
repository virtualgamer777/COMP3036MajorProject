using System.ComponentModel;
using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;

namespace Database;

public class Data
{	
	//database constructor
	private readonly IDbContextFactory<AppDbContext> dbFactory;

	//constructor takes db Factory
	public Data(IDbContextFactory<AppDbContext> dbFactory)
	{
		this.dbFactory = dbFactory;
	}

	public class CartItem
	{
		public UInt64 UserId { get; set; }
		public UInt64 ListingId { get; set; }

	}

	public class UserPurchase
	{
		public UInt64 PurchaseID { get; set; }
		public UInt64 UserID { get; set; }
		public UInt64 ProductID { get; set; }
		public DateTime Date { get; set; }
	}

	public class User
	{
		public UInt64 ID { get; set; }
		public string Username { get; set; } = "";
		public string Password { get; set; } = "";
		public bool IsAdmin { get; set; }
		//depreceated
		public Dictionary<UInt64, Listing> products { get; set; } = new();
	}

	[Flags]
	public enum ListingCategory
	{
		none = 0,
		electronics = 1 << 0,
		clothing = 1 << 1,
		automotive = 1 << 2,
		aeronautcs = 1 << 3,
		military = 1 << 4,

	}
	public class Listing
	{
		public UInt64 ID { get; set; }
		public string ItemName { get; set; } = "";
		public string ItemDescription { get; set; } = "";
		public ListingCategory Category { get; set; }
		public string Image { get; set; } = "";
		public uint Price { get; set; }
		public uint Quantity { get; set; }
		
	}

	public async Task Seed()
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();

		//reset db
		await db.Database.EnsureDeletedAsync();
		await db.Database.MigrateAsync();
		// Seed users
		db.Users.Add(new User
		{
			ID = 1,
			Username = "bob",
			Password = "todd",
			IsAdmin = true
		});

		// Seed listings
		db.Listings.AddRange(
			new Listing
			{
				ID = 1,
				ItemName = "Soviet Vacuum Tube",
				ItemDescription = "a soviet era vacuum tube from surplus.",
				Category = ListingCategory.electronics,
				Image = "https://media.discordapp.net/attachments/856023618261352489/1503623437309186098/image.png?ex=6a0d4073&is=6a0beef3&hm=272974ca60f795f10d2848cab82466b3d53098d7462834330dbb3660b7eca7f6&=&format=webp&quality=lossless",
				Price = 200000,
				Quantity = 4
			},
			new Listing
			{
				ID = 2,
				ItemName = "1990 Holden Commodore",
				ItemDescription = "A 1990 Holden Commodore, low odometer, in need of slight fixes",
				Category = ListingCategory.automotive,
				Image = "https://external-preview.redd.it/i-always-laugh-when-i-look-at-this-picture-what-in-the-v0-JZg3fULGc21qWhlfk3fbeL6xm6C9IhwPHSht-ul-TDI.jpeg?auto=webp&s=e3f4b1b42ccaf532512de24077c9caddb6b13a8f",
				Price = 2100000,
				Quantity = 2
			}
		);

		await db.SaveChangesAsync();
	}

	// private List<User> users =
	// [
	// 	new()
	// 	{
	// 		ID=0,
	// 		Username = "bob",
	// 		Password = "todd",
	// 		IsAdmin = true,
	// 		products = new Dictionary<UInt64, Listing>()
	// 	}
	// ];

	// private List<Listing> listings =
	// [
	// 	new() 
	// 	{
	// 		ID = 0,
	// 		ItemName = "Soviet Vacuum Tube",
	// 		ItemDescription = "a soviet era vacuum tube from surplus.",
	// 		Category = ListingCategory.electronics,
	// 		Image = "https://media.discordapp.net/attachments/856023618261352489/1503623437309186098/image.png?ex=6a0d4073&is=6a0beef3&hm=272974ca60f795f10d2848cab82466b3d53098d7462834330dbb3660b7eca7f6&=&format=webp&quality=lossless",
	// 		Price = 200000,
	// 		Quantity = 4
	// 	},
	// 	new()
	// 	{
	// 		ID = 1,
	// 		ItemName = "1990 Holden Commodore",
	// 		ItemDescription = "A 1990 Holden Commodore, low odometer, in need of slight fixes",
	// 		Category = ListingCategory.automotive,
	// 		Image = "https://external-preview.redd.it/i-always-laugh-when-i-look-at-this-picture-what-in-the-v0-JZg3fULGc21qWhlfk3fbeL6xm6C9IhwPHSht-ul-TDI.jpeg?auto=webp&s=e3f4b1b42ccaf532512de24077c9caddb6b13a8f",
	// 		Price = 2100000,
	// 		Quantity = 2
	// 	}
	// ];

	// private List<UserPurchase> purchases = [];

	// public UserPurchase[] getPurchases()
	// {
	// 	return [.. purchases];
	// }
	//get all purchases from database
	public async Task<UserPurchase[]> GetPurchasesAsync()
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.UserPurchases.ToArrayAsync();
	}

	// private void AppendPurchase(UInt64 productID, UInt64 userID)
	// {
	// 	purchases.Add(new UserPurchase
	// 	{
	// 		PurchaseID = (UInt64)purchases.Count,
	// 		UserID = userID,
	// 		ProductID = productID,
	// 		Date = DateTime.Now
	// 	});

	// }

	//add a new purchase to the database
	private async Task AppendPurchaseAsync(UInt64 productID, UInt64 userID)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		UInt64 nextId = (await db.UserPurchases.Select(p => (UInt64?)p.PurchaseID).MaxAsync() ?? 0UL) + 1UL;
		db.UserPurchases.Add(new UserPurchase
		{
			PurchaseID = nextId,
			UserID = userID,
			ProductID = productID,
			Date = DateTime.Now
		});

		await db.SaveChangesAsync();
	}

	// public User[] GetUsers()
	// {
	// 	return [.. users];
	// }
	//get all users from database
	public async Task<User[]> GetUsersAsync()
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.Users.ToArrayAsync();
	}

	
	// public Listing? GetListing(UInt64 ID)
	// {
	// 	Listing? listing = listings.Find((n) => n.ID == ID);
	// 	return listing;
	// }
	//get a specific listing from the database
	public async Task<Listing?> GetListingAsync(ulong id)
    {
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
        return await db.Listings.SingleAsync(l => l.ID == id);
    }


	// public Listing[] GetListings()
	// {
	// 	return [.. listings];
	// }
	//get all listings from the database
	public async Task<Listing[]> GetListingsAsync()
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.Listings.ToArrayAsync();
	}
	// public Listing[] GetListingsOfCategory(ListingCategory cat)
	// {
	// 	return [.. listings.FindAll(listing => (listing.Category & cat) != (ListingCategory)0)];
	// }
	//retrieve listing based on category
	public async Task<Listing[]> GetListingsOfCategoryAsync(ListingCategory cat)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.Listings.Where(l => (l.Category & cat) != ListingCategory.none).ToArrayAsync();
	}

	// public bool AddToCart(UInt64 userId, UInt64 listingId)
    // {
    //     var user = users.Find(u => u.ID == userId);
    //     if (user is null)
    //     {
    //         return false;
    //     }

    //     var listing = GetListing(listingId);
    //     if (listing is null)
    //     {
    //         return false;
    //     }
	// 	if(listing.Quantity <= 0)
	// 	{
	// 		return false;
	// 	}

    //     user.products[listingId] = listing;
    //     return true;
    // }

	//add an item to a users cart
	public async Task<bool> AddToCartAsync(UInt64 userId, UInt64 listingId)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		User? user = await db.Users.FindAsync(userId);
		if(user is null)
		{
			return false;
		}

		Listing? listing = await db.Listings.FindAsync(listingId);
		if(listing is null)
		{
			return false;
		}
		if(listing.Quantity <= 0)
		{
			return false;
		}
		if(await db.CartItems.Where(c => c.UserId == userId && c.ListingId == listingId).AnyAsync())
		{
			return false;
		}

		db.CartItems.Add(new CartItem
		{
			UserId = userId,
			ListingId = listingId
		});

		await db.SaveChangesAsync();
		return true;

	}

	// public Listing[] GetCartListings(UInt64 userId)
    // {
    //     var user = users.Find(u => u.ID == userId);
    //     if (user is null)
    //     {
    //         return [];
    //     }

    //     return [.. user.products.Values];
    // }

	//get the cart of a single user
	public async Task<Listing[]> GetCartListingsAsync(UInt64 userId)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.CartItems.Where(c => c.UserId == userId).Join(db.Listings, c=>c.ListingId, l => l.ID, (c, l) => l).ToArrayAsync();
	}

	// public bool IsInCart(UInt64 userId, UInt64 listingId)
	// {
	// 	var user = users.Find(u => u.ID == userId);
	// 	return user is not null && user.products.ContainsKey(listingId);
	// }

	public async Task<bool> IsInCartAsync(UInt64 userId, UInt64 listingId)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		return await db.CartItems.Where(c => c.UserId == userId && c.ListingId == listingId).AnyAsync();
	}

	// public bool Buy(UInt64[] products, UInt64 userID)
	// {
	// 	var user = users.Find(u => u.ID == userID);

	// 	if (user is null)
	// 	{
	// 		return false;
	// 	}


	// 	foreach (var productId in products)
	// 	{
	// 		var listing = GetListing(productId);
	// 		if (listing is null)
	// 		{
	// 			continue;
	// 		}

	// 		if (listing.Quantity > 0)
	// 		{
	// 			listing.Quantity--;
	// 		}
	// 		AppendPurchase(productId, userID);
	// 		user.products.Remove(productId);


	// 		if (listing.Quantity == 0)
	// 		{
	// 			//listings.RemoveAll(l => l.ID == productId);

	// 			foreach (var otherUser in users)
	// 			{
	// 				otherUser.products.Remove(productId);
	// 			}
	// 		}
	// 	}

    // return true;
	// }

	//"buy" products from a users cart
	public async Task<bool> BuyAsync(UInt64[] products, UInt64 userId)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		User? user = await db.Users.FindAsync(userId);
		if (user is null)
		{
			return false;
		}

		foreach(var productId in products)
		{
			Listing? listing = await db.Listings.FindAsync(productId);
			if(listing is null)
			{
				continue;
			}

			if (listing.Quantity > 0)
			{
				listing.Quantity--;
			}
			await AppendPurchaseAsync(productId, userId);
			db.CartItems.Remove(await db.CartItems.SingleAsync(c => c.ListingId == productId && c.UserId == userId));

			if(listing.Quantity == 0)
			{
				db.CartItems.RemoveRange(await db.CartItems.Where(c => c.ListingId == productId).ToListAsync());
			}
		}
		await db.SaveChangesAsync();
		return true;

	}

	// public bool CreateUser(string username, string password)
	// {
	// 	if (users.Any(u => string.Equals(u.Username, username, StringComparison.OrdinalIgnoreCase)))
	// 	{
	// 		return false;
	// 	}

	// 	var nextId = users.Count == 0 ? 0UL : users.Max(u => u.ID) + 1;

	// 	users.Add(new User
	// 	{
	// 		ID = nextId,
	// 		Username = username,
	// 		Password = password,
	// 		IsAdmin = false,
	// 		products = new Dictionary<UInt64, Listing>()
	// 	});

	// 	return true;
	// }

	//register a new user in the database
	public async Task<bool> CreateUserAsync(string username, string password)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		if(await db.Users.Where(u => u.Username == username).AnyAsync())
		{
			return false;
		}

		var nextId = (await db.Users.Select(u => (UInt64?)u.ID).MaxAsync() ?? 0UL) + 1UL;

		db.Users.Add(new User
		{
			ID = nextId,
			Username = username,
			Password = password,
			IsAdmin = false
		});

		await db.SaveChangesAsync();

		return true;
	}

	// public UInt64 CreateListing(string itemName, string itemDescription, ListingCategory category, string image, UInt32 price, UInt32 quantity)
	// {
	// 	if (string.IsNullOrWhiteSpace(itemName))
	// 	{
	// 		return 0;
	// 	}

	// 	UInt64 nextId = listings.Count == 0 ? 0UL : listings.Max(l => l.ID) + 1;

	// 	listings.Add(new Listing
	// 	{
	// 		ID = nextId,
	// 		ItemName = itemName,
	// 		ItemDescription = itemDescription,
	// 		Category = category,
	// 		Image = image,
	// 		Price = price,
	// 		Quantity = quantity
	// 	});

	// 	return nextId;
	// }

	//create a new listing and add it to the database
	public async Task<UInt64> CreateListingAsync(string itemName, string itemDescription, ListingCategory category, string image, UInt32 price, UInt32 quantity)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		if(string.IsNullOrWhiteSpace(itemName))
		{
			return 0;
		}

		UInt64 nextId = (await db.Listings.Select(l => (UInt64?)l.ID).MaxAsync() ?? 0UL) + 1UL;

		db.Listings.Add(new Listing
		{
			ID = nextId,
			ItemName = itemName,
			ItemDescription = itemDescription,
			Category = category,
			Image = image,
			Price = price,
			Quantity = quantity
		});

		await db.SaveChangesAsync();
		return nextId;
	}

	// public bool UpdateListing(UInt64 listingId, string itemName, string itemDescription, 
	// 	ListingCategory category, string image, UInt32 price, UInt32 quantity)
	// {
	// 	var listing = GetListing(listingId);
	// 	if (listing is null)
	// 	{
	// 		return false;
	// 	}

	// 	listing.ItemName = itemName;
	// 	listing.ItemDescription = itemDescription;
	// 	listing.Category = category;
	// 	listing.Image = image;
	// 	listing.Price = price;
	// 	listing.Quantity = quantity;

	// 	return true;
	// }

	//update an existing listing in the database
	public async Task<bool> UpdateListingAsync(UInt64 listingId, string itemName, string itemDescription, ListingCategory category, string image, UInt32 price, UInt32 quantity)
	{
		await using AppDbContext db = await dbFactory.CreateDbContextAsync();
		Listing? listing = await db.Listings.FindAsync(listingId);
		if (listing is null) return false;

		listing.ItemName = itemName;
		listing.ItemDescription = itemDescription;
		listing.Category = category;
		listing.Image = image;
		listing.Price = price;
		listing.Quantity = quantity;

		await db.SaveChangesAsync();
		return true;
	}


}