using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests
{
	[TestFixture]
	[NonParallelizable]
	public class ListingDashboardTest : PageTest
	{
		public override BrowserNewContextOptions ContextOptions()
		{
			return new BrowserNewContextOptions
			{
				BaseURL = "http://localhost:5134"
			};
		}

		[OneTimeSetUp]
		public async Task SeedDatabase()
		{
			using var client = new HttpClient { BaseAddress = new Uri("http://localhost:5134") };
			await client.PostAsync("/api/seed", null);
		}

		[SetUp]
		public async Task Login()
		{
			await Page.GotoAsync("http://localhost:5134/login");
			await Page.GetByLabel("Username").FillAsync(TestEmail);
			await Page.GetByLabel("Password").FillAsync(TestPassword);
			await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
			await Expect(Page.GetByText("Sign out")).ToBeVisibleAsync();
		}

		private const string TestEmail = "bob";
		private const string TestPassword = "todd";

		[Test]
		public async Task ListingDashboard_ShouldContain_ExpectedControls()
		{
			await Page.GotoAsync("http://localhost:5134/admin/listingdashboard");

			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Listings Dashboard" })).ToBeVisibleAsync();
			await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Create Listing" })).ToBeVisibleAsync();
			await Expect(Page.GetByPlaceholder("Search listings...")).ToBeVisibleAsync();
		}

		[Test]
		public async Task ListingDashboard_CreateListing_Button_NavigatesToCreateListingPage()
		{
			await Page.GotoAsync("http://localhost:5134/admin/listingdashboard");

			await Page.GetByRole(AriaRole.Button, new() { Name = "Create Listing" }).ClickAsync();

			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/createlisting$"));
		}

		[Test]
		public async Task ListingDashboard_Search_Filters_Listings()
		{
			await Page.GotoAsync("http://localhost:5134/admin/listingdashboard");
			await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(2);

			var search = Page.GetByPlaceholder("Search listings...");
			await search.FillAsync("holden");
			await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
			await Expect(Page.GetByText("1990 Holden Commodore", new() { Exact = true })).ToBeVisibleAsync();
		}
	}
}
