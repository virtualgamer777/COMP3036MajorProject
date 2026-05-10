namespace Database;

public class Data
{
	public enum ListingCategory
	{
		electronics = 0,
		clothing = 1 << 0,
		soviet = 1 << 1,
		automotive = 1 << 2,

	}
	public struct Listing
	{
		public UInt64 ID;
		public String ItemName;
		public String ItemDescription;
		public ListingCategory Category;
		public String Image;
		public UInt32 Price;
	}

	private List<Listing> listings = new List<Listing>
	{
		new() 
		{
			ID = 0,
			ItemName = "Soviet Vacuum Tube",
			ItemDescription = "a soviet era vacuum tube from surplus.",
			Category = ListingCategory.electronics | ListingCategory.soviet,
			Image = "https://cdn.discordapp.com/attachments/783256272602398721/1502935023102201926/il_fullxfull.6799126183_6y4z.jpg?ex=6a0184d0&is=6a003350&hm=be7e5f63936f47d7de39664a2ebd7af454592b8e10f968af48e69cec5c733110&",
			Price = 200000
		},
		new()
		{
			ID = 1,
			ItemName = "1990 Holden Commodore",
			ItemDescription = "A 1990 Holden Commodore, low odometer, in need of slight fixes",
			Category = ListingCategory.automotive,
			Image = "https://external-preview.redd.it/i-always-laugh-when-i-look-at-this-picture-what-in-the-v0-JZg3fULGc21qWhlfk3fbeL6xm6C9IhwPHSht-ul-TDI.jpeg?auto=webp&s=e3f4b1b42ccaf532512de24077c9caddb6b13a8f",
			Price = 2100000
		}
	};

	public Listing[] GetListings()
	{
		return listings.ToArray();
	}
}