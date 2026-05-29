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
	public class AccountTest : PageTest
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

		[Test]
		public async Task LoginPage_ShouldContain_LoginForm()
		{
			await Page.GotoAsync("http://localhost:5134/login");

			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Sign in" })).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Username")).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Password")).ToBeVisibleAsync();
			await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" })).ToBeVisibleAsync();
		}

		[Test]
		public async Task RegisterPage_ShouldContain_RegistrationForm()
		{
			await Page.GotoAsync("http://localhost:5134/register");

			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Create account" })).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Username")).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Password", new() {Exact = true})).ToBeVisibleAsync();
			await Expect(Page.GetByLabel("Confirm password")).ToBeVisibleAsync();
			await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Register" })).ToBeVisibleAsync();
		}

		[Test]
		public async Task CanLogin_Bob_ShouldAccess_AdminPages()
		{
			await LoginAsAsync("bob", "todd");
			await Page.GotoAsync("/admin/listingdashboard");

			await Expect(Page).ToHaveURLAsync(new Regex("/admin/listingdashboard$", RegexOptions.IgnoreCase));
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Listings Dashboard" })).ToBeVisibleAsync();
			await Expect(Page.GetByText("Hello bob", new() { Exact = false })).ToBeVisibleAsync();
		}

		[Test]
		public async Task CanCreateNewUser_NewUserShouldNotAccess_AdminPages()
		{
			var username = $"user{Guid.NewGuid():N}";

			await Page.GotoAsync("/register");
			await Page.GetByLabel("Username", new() { Exact = true }).FillAsync(username);
			await Page.GetByLabel("Password", new() { Exact = true }).FillAsync("test1234");
			await Page.GetByLabel("Confirm password", new() { Exact = true }).FillAsync("test1234");
			await Page.GetByRole(AriaRole.Button, new() { Name = "Register" }).ClickAsync();

			await LoginAsAsync(username, "test1234");
			//Console.WriteLine("page Url: " + Page.Url);
			await Expect(Page.GetByText($"Hello {username}", new() { Exact = false })).ToBeVisibleAsync();
			await Page.GotoAsync("/admin/listingdashboard");

			//Console.WriteLine("page Url: " + Page.Url);

			await Expect(Page).ToHaveURLAsync(new Regex("/$", RegexOptions.IgnoreCase));
			await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Listings" })).ToBeVisibleAsync();
		}

		private async Task LoginAsAsync(string username, string password)
		{
			await Page.GotoAsync("http://localhost:5134/login");
			await Page.GetByLabel("Username").FillAsync(username);
			await Page.GetByLabel("Password").FillAsync(password);
			await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
		}
	}
}
