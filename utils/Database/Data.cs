using System.Net.Http.Headers;

namespace Database;

public class Data
{
	public class User
	{
		public required UInt64 ID;
		public required string Username;
		public required string Password;
		public required bool IsAdmin;
		public required Dictionary<UInt64, Listing> products; // changed from List[UInt64]

	}

	[Flags]
	public enum ListingCategory
	{
		electronics = 1 << 0,
		clothing = 1 << 1,
		automotive = 1 << 2,
		aeronautcs = 1 << 3,
		military = 1 << 4,

	}
	public class Listing
	{
		public required UInt64 ID;
		public required String ItemName;
		public required String ItemDescription;
		public required ListingCategory Category;
		public required String Image;
		public required UInt32 Price;
		public required UInt32 Quantity;
	}

	private List<User> users =
	[
		new()
		{
			ID=0,
			Username = "bob",
			Password = "todd",
			IsAdmin = true,
			products = new Dictionary<UInt64, Listing>()
		}
	];

	private List<Listing> listings =
	[
		new() 
		{
			ID = 0,
			ItemName = "Soviet Vacuum Tube",
			ItemDescription = "a soviet era vacuum tube from surplus.",
			Category = ListingCategory.electronics,
			Image = "https://cdn.discordapp.com/attachments/856023618261352489/1503623437309186098/image.png?ex=6a0751b3&is=6a060033&hm=7c747eec6bee40a3c166e69e2581381fee31d19137811bcb7870851e96c8b2c7&",
			Price = 200000,
			Quantity = 4
		},
		new()
		{
			ID = 1,
			ItemName = "1990 Holden Commodore",
			ItemDescription = "A 1990 Holden Commodore, low odometer, in need of slight fixes",
			Category = ListingCategory.automotive,
			Image = "https://external-preview.redd.it/i-always-laugh-when-i-look-at-this-picture-what-in-the-v0-JZg3fULGc21qWhlfk3fbeL6xm6C9IhwPHSht-ul-TDI.jpeg?auto=webp&s=e3f4b1b42ccaf532512de24077c9caddb6b13a8f",
			Price = 2100000,
			Quantity = 2
		}
	];

	public User[] GetUsers()
	{
		return [.. users];
	}

	public Listing? GetListing(UInt64 ID)
	{
		Listing? listing = listings.Find((n) => n.ID == ID);
		return listing;
	}

	public Listing[] GetListings()
	{
		return [.. listings];
	}

	public Listing[] GetListingsOfCategory(ListingCategory cat)
	{
		return [.. listings.FindAll(listing => (listing.Category & cat) != (ListingCategory)0)];
	}
	public bool AddToCart(UInt64 userId, UInt64 listingId)
    {
        var user = users.Find(u => u.ID == userId);
        if (user is null)
        {
            return false;
        }

        var listing = GetListing(listingId);
        if (listing is null)
        {
            return false;
        }

        user.products[listingId] = listing;
        return true;
    }
	public Listing[] GetCartListings(UInt64 userId)
    {
        var user = users.Find(u => u.ID == userId);
        if (user is null)
        {
            return [];
        }

        return [.. user.products.Values];
    }
	public bool IsInCart(UInt64 userId, UInt64 listingId)
	{
		var user = users.Find(u => u.ID == userId);
		return user is not null && user.products.ContainsKey(listingId);
	}

	public bool Buy(UInt64[] products, UInt64 userID)
	{
		var user = users.Find(u => u.ID == userID);

		if (user is null)
		{
			return false;
		}


		foreach (var productId in products)
		{
			var listing = GetListing(productId);
			if (listing is null)
			{
				continue;
			}

			if (listing.Quantity > 0)
			{
				listing.Quantity--;
			}

			user.products.Remove(productId);


			if (listing.Quantity == 0)
			{
				listings.RemoveAll(l => l.ID == productId);

				foreach (var otherUser in users)
				{
					otherUser.products.Remove(productId);
				}
			}
		}

    return true;
	}

	public bool CreateUser(string username, string password)
	{
		if (users.Any(u => string.Equals(u.Username, username, StringComparison.OrdinalIgnoreCase)))
		{
			return false;
		}

		var nextId = users.Count == 0 ? 0UL : users.Max(u => u.ID) + 1;

		users.Add(new User
		{
			ID = nextId,
			Username = username,
			Password = password,
			IsAdmin = false,
			products = new Dictionary<UInt64, Listing>()
		});

		return true;
	}
}