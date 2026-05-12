namespace Database;

public class Data
{
	public class User
	{
		public required UInt64 ID;
		public required string Username;
		public required string Password;
		public required bool IsAdmin;
		public required List<UInt64> products; // changed from List[UInt64]

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
			products = []
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
			Image = "https://cdn.discordapp.com/attachments/856023618261352489/1503623437309186098/image.png?ex=6a0405f3&is=6a02b473&hm=af17f3571f4340d199b176bb76fcd71fbaa0bbbcd9978ec261e7a419824db1b6&",
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
}