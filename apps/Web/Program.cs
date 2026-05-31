using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Web.Components;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IPasswordHasher<Database.Data.User>, PasswordHasher<Database.Data.User>>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<HttpClient>();

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
    
//auth service
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
    {
        options.Cookie.Name = "auth_token_web";
        options.AccessDeniedPath = "/";
        options.LoginPath = "/login";
        options.Cookie.MaxAge = TimeSpan.FromHours(4);
        options.Events = new CookieAuthenticationEvents
		{
            OnRedirectToLogin = context =>
            {
                // Redirect to the login path without the ReturnUrl query
                context.Response.Redirect(context.Options.LoginPath);
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                // Redirect to the access-denied path (or "/") without any query
                var destination = context.Options.AccessDeniedPath.HasValue ? context.Options.AccessDeniedPath.Value : "/";
                context.Response.Redirect(destination);
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddCascadingAuthenticationState();

var connectionString = builder.Configuration.GetConnectionString("PostgreSQL");
// builder.Services.AddDbContext<Database.AppDbContext>(options =>
//     options.UseNpgsql(connectionString));
builder.Services.AddDbContextFactory<Database.AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// builder.Services.AddSingleton<Database.Data>();
builder.Services.AddScoped<Database.Data>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

//short routes

//logout route
// app.MapGet("/logout", async (HttpContext http) =>
// {
//     await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
//     return Results.Redirect("/");
// });

//logout api route
app.MapDelete("/api/logout", async (HttpContext http) =>
{
    await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //return Results.Redirect("/");
});

//seed api route
if (app.Environment.IsDevelopment())
{
    app.MapPost("/api/seed", async (Database.Data data, HttpContext http) =>
    {
        // seed logic here
        await data.Seed();
        return Results.Ok();
    });
}

app.Run();
