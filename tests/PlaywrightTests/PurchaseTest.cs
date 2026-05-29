using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests
{
	[TestFixture]
	[NonParallelizable]
	public class PurchaseTest : PageTest
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
			//await SignInAsync();
			//await Expect(Page.GetByText("Sign Out")).ToBeVisibleAsync();
		}

		[SetUp]
		public async Task login()
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
		[Order(1)]
		public async Task User_Can_Add_Item_To_Cart()
		{
			await Page.GotoAsync("http://localhost:5134/");
			await AddFirstItemToCartAsync();

			await Page.GetByText("Cart", new() { Exact = true }).ClickAsync();
			await Page.GetByText("Cart", new() { Exact = true }).ClickAsync();
			await Page.GetByRole(AriaRole.Link, new() { Name = "Cart", Exact = true }).ClickAsync();
			await Expect(Page.Locator("div#listing")).ToHaveCountAsync(1);
			//await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Checkout" })).ToBeVisibleAsync(); - AI be wild.
		}

		[Test]
		[Order(2)]
		public async Task User_Can_Purchase_Items_In_Cart()
		{
			await Page.GotoAsync("http://localhost:5134/");

			await Page.GetByText("Cart", new() { Exact = true }).ClickAsync();
			await Page.GetByRole(AriaRole.Link, new() { Name = "Cart", Exact = true }).ClickAsync();

			//await Page.GetByRole(AriaRole.Button, new() { Name = "Checkout" }).ClickAsync();
			await Expect(Page.Locator("div#listing")).ToHaveCountAsync(1);
			await Page.GetByRole(AriaRole.Button, new() {Name = "Purchase"}).ClickAsync();
			await Expect(Page.Locator("div#listing")).Not.ToBeVisibleAsync();
		}

		private async Task AddFirstItemToCartAsync()
		{
			var addToCart = Page.GetByRole(AriaRole.Button, new() { Name = "Add to Cart" }).First;
			await Expect(addToCart).ToBeVisibleAsync();
			await addToCart.ClickAsync();
			await Expect(Page.GetByText("Already in cart")).ToBeVisibleAsync();
		}

		private static async Task FillIfVisibleAsync(ILocator locator, string value)
		{
			if (await locator.CountAsync() > 0)
			{
				await locator.First.FillAsync(value);
			}
		}

		private static async Task ClickFirstVisibleAsync(params ILocator[] locators)
		{
			foreach (var locator in locators)
			{
				if (await locator.CountAsync() > 0)
				{
					await locator.First.ClickAsync();
					return;
				}
			}

			Assert.Fail("No matching sign-in button was found.");
		}
	}
}
