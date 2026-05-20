using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests
{
    [TestFixture]
    public class HomeTest : PageTest
    {
		public override BrowserNewContextOptions ContextOptions()
		{
			return new BrowserNewContextOptions
			{
				BaseURL = "http://localhost:5134"
			};
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
            
			var cart = Page.GetByText("Cart", new() { Exact = true });
			await Expect(cart).ToBeVisibleAsync();
        }

        [Test]
        public async Task HomePage_ShouldContain_ExpectedNumberOfArticles()
        {
            await Page.GotoAsync("http://localhost:5134/");
			//Console.WriteLine(await Page.Locator("article.listing-card").InnerHTMLAsync());
			await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(2);

            
        }
    }
}
