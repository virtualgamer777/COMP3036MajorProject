using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests
{
    
    [TestFixture]
    [NonParallelizable]
    public class HomeTest : PageTest
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


        // Expected values sourced from the app's Nav, Home menu, Data.cs and MainLayout
        private static readonly string[] ExpectedNavItems = new[] { "B2C", "Home", "Categories" };
        private const int ExpectedArticlesCount = 3;

        // Inherit shared Playwright/Page setup and expectation values from PageTest (UnitTest1.cs)
        [Test]
        public async Task HomePage_ShouldContain_ExpectedNavMenuItems()
        {
            await Page.GotoAsync("http://localhost:5134/");
			//Console.WriteLine(await Page.ContentAsync());

            // Verify nav menu items exist by their visible text
            foreach (var item in ExpectedNavItems)
            {
                var htmlItem = Page.GetByText($"{item}");
				await Expect(htmlItem).ToBeVisibleAsync();
            }
        }

        [Test]
        public async Task HomePage_ShouldContain_ExpectedTopBarItems()
        {
            await Page.GotoAsync("http://localhost:5134/");

            // Top bar (MainLayout) often contains branding or links in a header; check those texts exist

			var signIn = Page.GetByText("Sign In");
			await Expect(signIn).ToBeVisibleAsync();
            
            // cart should not be visible when signed out
			// var cart = Page.GetByText("Cart", new() { Exact = true });
			// await Expect(cart).ToBeVisibleAsync();
        }

        [Test]
        public async Task HomePage_ShouldContain_ExpectedNumberOfArticles()
        {
            await Page.GotoAsync("http://localhost:5134/");
			//Console.WriteLine(await Page.Locator("article.listing-card").InnerHTMLAsync());
			await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(2);

            
        }

        [Test]
		public async Task Home_Search_Filters_Listings()
		{
			await Page.GotoAsync("http://localhost:5134/");

			var search = Page.GetByPlaceholder("Search listings...");
			await search.FillAsync("holden");

			await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
			await Expect(Page.GetByText("1990 Holden Commodore", new() { Exact = true })).ToBeVisibleAsync();
		}
    }
}
