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
	public class MyPurchasesTest : PageTest
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
		public async Task MyPurchases_Page_ShouldLoad()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/purchases$"));
		}

		[Test]
		public async Task MyPurchases_Page_ShouldDisplay_PageTitle()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });
		}

		[Test]
		public async Task MyPurchases_Page_ShouldDisplay_UserPurchases()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var items = Page.Locator("li.list-group-item");
			Assert.That(await items.CountAsync(), Is.GreaterThan(0));
			await Expect(items.First).ToBeVisibleAsync();
		}

		[Test]
		public async Task MyPurchases_PurchaseItem_ShouldDisplay_ItemName()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var items = Page.Locator("li.list-group-item");
			if (await items.CountAsync() > 0)
			{
				await Expect(items.First.Locator(".fw-bold")).ToContainTextAsync(new Regex(".+"));
			}
		}

		[Test]
		public async Task MyPurchases_PurchaseItem_ShouldDisplay_ProductID()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var items = Page.Locator("li.list-group-item");
			if (await items.CountAsync() > 0)
			{
				await Expect(items.First).ToContainTextAsync(new Regex(@"Product ID:\s*\d+"));
			}
		}

		[Test]
		public async Task MyPurchases_PurchaseItem_ShouldDisplay_Date()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var items = Page.Locator("li.list-group-item");
			if (await items.CountAsync() > 0)
			{
				var dateText = items.First.Locator(".text-end div").First;
				await Expect(dateText).ToContainTextAsync(new Regex(@".+"));
			}
		}

		[Test]
		public async Task MyPurchases_PurchaseItem_ShouldDisplay_PurchaseID()
		{
			await Page.GotoAsync("http://localhost:5134/purchases");
			await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "My Purchases" }))
				.ToBeVisibleAsync(new() { Timeout = 10000 });

			var items = Page.Locator("li.list-group-item");
			if (await items.CountAsync() > 0)
			{
				await Expect(items.First).ToContainTextAsync(new Regex(@"Purchase #\d+"));
			}
		}

		[Test]
		public async Task MyPurchases_ShouldRequire_Authentication()
		{
			await Page.GotoAsync("http://localhost:5134");
			await Page.GetByText("Sign out").ClickAsync();
			await Expect(Page.GetByText("Sign in")).Not.ToBeVisibleAsync();

			await Page.GotoAsync("http://localhost:5134/purchases");
			await Expect(Page).ToHaveURLAsync(new Regex(@"(.*/$|.*/login)"));
		}
	}
}
