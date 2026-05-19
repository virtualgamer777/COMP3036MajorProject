using System.Threading.Tasks;
using Microsoft.Playwright;
using NUnit.Framework;

[TestFixture]
public class UiTests
{
    IPlaywright? _pw;
    IBrowser? _browser;

    [OneTimeSetUp]
    public async Task OneTimeSetUpAsync()
    {
        _pw = await Playwright.CreateAsync();
        _browser = await _pw.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDownAsync()
    {
        if (_browser != null) await _browser.CloseAsync();
        _pw?.Dispose();
    }

    [Test]
    public async Task HomePageLoads()
    {
        var page = await _browser!.NewPageAsync();
        await page.GotoAsync("http://localhost:5134/"); // adjust URL/port as needed
        Assert.That(await page.Locator("text=Home").CountAsync(), Is.GreaterThan(0));
    }
}