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
	public class CreateListingTest : PageTest
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
		public async Task CreateListing_Page_ShouldLoad()
		{
			await Page.GotoAsync("http://localhost:5134/admin/createlisting");
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/createlisting$"));
		}

		[Test]
		public async Task CreateListing_Form_ShouldBeVisible()
		{
			await Page.GotoAsync("http://localhost:5134/admin/createlisting");
			await Expect(Page.GetByText("Create Listing")).ToBeVisibleAsync();
			//await Expect(Page.GetByRole(AriaRole.Form)).ToBeVisibleAsync();
		}

		[Test]
		public async Task CreateListing_SubmittingForm_NavigatesToEditPage()
		{
			await Page.GotoAsync("http://localhost:5134/admin/createlisting");
			
			// Fill in all required form fields
			await Page.GetByLabel("Item Name").FillAsync("Test Item");
			await Page.GetByLabel("Description").FillAsync("This is a test item description");
			//await Page.GetByLabel("Categories").SelectOptionAsync("Electronics");
			await Page.Locator("#cat_electronics").CheckAsync();
			await Expect(Page.Locator("#cat_electronics")).ToBeCheckedAsync();
			await Page.GetByLabel("Image URL").FillAsync("https://example.com/image.jpg");
			await Page.GetByLabel("Price (in cents)").FillAsync("9999");
			await Page.GetByLabel("Quantity").FillAsync("10");
			
			// Submit the form
			await Task.WhenAll(
				Page.WaitForURLAsync(new Regex(@".*/admin/edit/\d+$")),
				Page.GetByRole(AriaRole.Button, new() { Name = "Create" }).ClickAsync()
			);
		}

		[Test]
		public async Task CreateListing_InvalidSubmission_StaysOnCreatePage()
		{
			await Page.GotoAsync("http://localhost:5134/admin/createlisting");
			
			// Try to submit empty form
			await Page.GetByRole(AriaRole.Button, new() { Name = "Create" }).ClickAsync();
			
			await Expect(Page.GetByText("The ItemName field is required.")).ToBeVisibleAsync();
			await Expect(Page.GetByText("The ItemDescription field is required.")).ToBeVisibleAsync();
			await Expect(Page.GetByText("The Image field is required.")).ToBeVisibleAsync();
			await Expect(Page.GetByText("Price must be greater than 0.")).ToBeVisibleAsync();
			await Expect(Page.GetByText("Quantity must be greater than 0.")).ToBeVisibleAsync();
			//Console.WriteLine(await Page.ContentAsync());
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/createlisting$"));
		}

		[Test]
		public async Task CreateListing_MissingCategoryField_SubmissionFails()
		{
			await Page.GotoAsync("http://localhost:5134/admin/createlisting");
			
			await Page.GetByLabel("Item Name").FillAsync("Test Item2");
			await Page.GetByLabel("Description").FillAsync("This is a test item description2");
			await Page.GetByLabel("Image URL").FillAsync("https://example.com/image.jpg");
			await Page.GetByLabel("Price (in cents)").FillAsync("9999");
			await Page.GetByLabel("Quantity").FillAsync("10");
			
			await Page.GetByRole(AriaRole.Button, new() { Name = "Create" }).ClickAsync();
			
			await Expect(Page).ToHaveURLAsync(new Regex(@".*/admin/createlisting$"));
			await Expect(Page.GetByText("Please select at least one category.")).ToBeVisibleAsync();
		}
	}
}
