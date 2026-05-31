using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests
{
    [TestFixture]
    [NonParallelizable]
    public class CategoriesTest : PageTest
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
        public async Task ElectronicsCategory_ShouldShow_OnlyElectronicsListing()
        {

            await Page.GotoAsync("/category/electronics");

            await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);

            await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Category: electronics" }))
                .ToBeVisibleAsync();

            await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
            await Expect(Page.GetByText("Soviet Vacuum Tube", new() { Exact = true })).ToBeVisibleAsync();
            await Expect(Page.GetByText("Price: $2000.00", new() { Exact = true })).ToBeVisibleAsync();
            await Expect(Page.GetByText("Amount Available: 4", new() { Exact = true })).ToBeVisibleAsync();
            await Expect(Page.GetByAltText("Soviet Vacuum Tube")).ToBeVisibleAsync();

            await Expect(Page.GetByText("1990 Holden Commodore", new() { Exact = true })).Not.ToBeVisibleAsync();
        }

        [Test]
        public async Task AutomotiveCategory_ShouldShow_OnlyAutomotiveListing()
        {
            await Page.GotoAsync("/category/automotive");
            await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
            //Console.WriteLine(await Page.ContentAsync());

            await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Category: automotive" }))
                .ToBeVisibleAsync();

            await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
            await Expect(Page.GetByText("1990 Holden Commodore", new() { Exact = true })).ToBeVisibleAsync();
            await Expect(Page.GetByText("Price: $21000.00", new() { Exact = true })).ToBeVisibleAsync();
            await Expect(Page.GetByText("Amount Available: 2", new() { Exact = true })).ToBeVisibleAsync();

            await Expect(Page.GetByText("Soviet Vacuum Tube", new() { Exact = true })).Not.ToBeVisibleAsync();
        }

        [Test]
        public async Task CategoryRoute_ShouldBe_CaseInsensitive()
        {
            await Page.GotoAsync("/category/ELECTRONICS");

            await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Category: ELECTRONICS" }))
                .ToBeVisibleAsync();

            await Expect(Page.Locator("article.listing-card")).ToHaveCountAsync(1);
            await Expect(Page.GetByText("Soviet Vacuum Tube", new() { Exact = true })).ToBeVisibleAsync();
        }

        [Test]
        public async Task EmptyCategory_ShouldShow_NoListingsFound()
        {
            await Page.GotoAsync("/category/clothing");

            await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Category: clothing" }))
                .ToBeVisibleAsync();

            await Expect(Page.GetByText("No listings found.", new() { Exact = true }))
                .ToBeVisibleAsync();
        }

        [Test]
        public async Task InvalidCategory_ShouldShow_NoListingsFound()
        {
            await Page.GotoAsync("/category/not-a-real-category");

            await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Category: not-a-real-category" }))
                .ToBeVisibleAsync();

            await Expect(Page.GetByText("No listings found.", new() { Exact = true }))
                .ToBeVisibleAsync();
        }
    }
}