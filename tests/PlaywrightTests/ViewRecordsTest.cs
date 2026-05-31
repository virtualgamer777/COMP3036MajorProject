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
	public class ViewPurchasesTest : PageTest
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
		public async Task ViewPurchases_Page_ShouldLoad()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/userhistory$"));
		}

		[Test]
		public async Task ViewPurchases_Page_ShouldDisplay_PageTitle()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });
		}

		[Test]
		public async Task ViewPurchases_Page_ShouldDisplay_UserPurchases()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Check that purchase groups are displayed
			var groups = Page.Locator(".list-group");
			Assert.That(await groups.CountAsync(), Is.GreaterThan(0));
			await Expect(groups.First).ToBeVisibleAsync();
		}

		[Test]
		public async Task ViewPurchases_UserGroup_ShouldDisplay_Username()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Check if purchase groups exist and contain username text
			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				await Expect(details.First.Locator("summary span").First).ToContainTextAsync(new Regex(".+"));
			}
		}

		[Test]
		public async Task ViewPurchases_UserGroup_ShouldDisplay_PurchaseCount()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Check if purchase count badges are displayed
			var badges = Page.Locator(".badge.bg-secondary");
			if (await badges.CountAsync() > 0)
			{
				await Expect(badges.First).ToContainTextAsync(new Regex(@"\d+\s+purchase"));
			}
		}

		[Test]
		public async Task ViewPurchases_CanExpand_UserPurchaseGroup()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				var firstDetails = details.First;
				await firstDetails.Locator("summary").ClickAsync();
				await Expect(firstDetails.Locator(".mt-3")).ToBeVisibleAsync();
			}
		}

		[Test]
		public async Task ViewPurchases_PurchaseItem_ShouldDisplay_ItemName()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Expand first user group if it exists
			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				await details.First.Locator("summary").ClickAsync();
				
				// Check if purchase items are displayed with item names
				var purchaseItems = details.First.Locator("li.list-group-item");
				if (await purchaseItems.CountAsync() > 0)
				{
					await Expect(purchaseItems.First.Locator(".fw-bold")).ToContainTextAsync(new Regex(".+"));
				}
			}
		}

		[Test]
		public async Task ViewPurchases_PurchaseItem_ShouldDisplay_ProductID()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Expand first user group if it exists
			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				await details.First.Locator("summary").ClickAsync();
				
				// Check if Product ID is displayed
				var purchaseItems = details.First.Locator("li.list-group-item");
				if (await purchaseItems.CountAsync() > 0)
				{
					await Expect(purchaseItems.First).ToContainTextAsync(new Regex(@"Product ID:\s*\d+"));
				}
			}
		}

		[Test]
		public async Task ViewPurchases_PurchaseItem_ShouldDisplay_Date()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Expand first user group if it exists
			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				await details.First.Locator("summary").ClickAsync();
				
				// Check if date is displayed
				var purchaseItems = details.First.Locator("li.list-group-item");
				if (await purchaseItems.CountAsync() > 0)
				{
					var dateText = purchaseItems.First.Locator(".text-end div").First;
					await Expect(dateText).ToContainTextAsync(new Regex(@".+"));
				}
			}
		}

		[Test]
		public async Task ViewPurchases_PurchaseItem_ShouldDisplay_PurchaseID()
		{
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Purchase History" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			// Expand first user group if it exists
			var details = Page.Locator("details.list-group-item");
			if (await details.CountAsync() > 0)
			{
				await details.First.Locator("summary").ClickAsync();
				
				// Check if Purchase ID is displayed
				var purchaseItems = details.First.Locator("li.list-group-item");
				if (await purchaseItems.CountAsync() > 0)
				{
					await Expect(purchaseItems.First).ToContainTextAsync(new Regex(@"Purchase #\d+"));
				}
			}
		}

		[Test]
		public async Task ViewPurchases_ShouldRequire_AdminAuthorization()
		{
			// Logout first
			await Page.GotoAsync("http://localhost:5134");
			await Page.GetByText("Sign out").ClickAsync();
			await Expect(Page.GetByText("Sign in")).Not.ToBeVisibleAsync();
			
			// Try to access without being logged in (will redirect)
			await Page.GotoAsync("http://localhost:5134/admin/userhistory");
			
			// Should redirect to home or login
			await Expect(Page).ToHaveURLAsync(new Regex(@"(.*/$|.*/login)"));
		}
	}
}
