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
	public class EditListingTest : PageTest
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
		public async Task EditListingRoute_LoadsEditPage()
		{
			await Page.GotoAsync("http://localhost:5134/admin/edit/1");

			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/edit/1$"));
		}

		[Test]
		public async Task EditListingRoute_ShowsListingModifierForm()
		{
			await Page.GotoAsync("http://localhost:5134/admin/edit/1");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Edit Listing" }))
    			.ToBeVisibleAsync(new() { Timeout = 10000 });

			await Expect(Page.GetByText("Edit Listing")).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Item Name")).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Description")).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Price")).ToBeVisibleAsync();
		}

		[Test]
		public async Task EditListingRoute_CanSubmitChanges()
		{
			await Page.GotoAsync("http://localhost:5134/admin/edit/1");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Edit Listing" }))
    			.ToBeVisibleAsync(new() { Timeout = 10000 });

			await Page.GetByLabel("Item Name").FillAsync("Updated title");
			await Page.GetByLabel("Description").FillAsync("Updated description");
			await Page.GetByLabel("Price").FillAsync("25");

			await Page.GetByRole(AriaRole.Button, new() { Name = "Update" }).ClickAsync();
			//await Page.WaitForTimeoutAsync(2000);
			
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/listingdashboard$"));
		}
	}
}
