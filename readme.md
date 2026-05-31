# Setup Instructions 

## Requirements
To run this website you require
- dotnet SDK v10.0.104 or newer (some older versions may work)
- Some OS's or linux distrobutions may require other ASP.NET external packages
- A postgreSQL database

## Installing dependencies (optional)
you need to install the dotnet entity framework, use `dotnet tool install --global dotnet-ef --version 10.0.7` to install it.
Usually this is not a requirement. However, if there are any issues try to run `dotnet restore` in the root of the repository.

## preparing the database
you must push the schema to the database.
to do so, first export the variable's `ASPNETCORE_ENVIRONMENT=Development`  & `ConnectionStrings__PostgreSQL='Host=localhost;Port=5432;Database=dev;Username=postgres;Password=password;Include Error Detail=true'` replacing the connection string information with your postgres database.
after exporting that shell variable, run `dotnet ef database update --project utils/Database --startup-project apps/Web` from the root of the project.

Copy the apps/Web/Properties/LaunchSettings.json.example to LaunchSettings.json and replace the ConnectionStrings__PostgreSQL values to what you used in the previous steps.

# The quick way to do things
if you've installed everything listed above and you are on linux (macos may also work but this is untested.) there is a Makefile at the root of the project to help automate things. the available commands are

> `make build` to build the projecct.
> `make watch-web` to run the site with hot reloading.
> `make start` !NOT RECOMMENDED as this is intended to be used by tests.
> `make test` automates starting the server, running tests, and killing the server afterwards.

## building
To build the application, go to the root directory (or web, both work) & run `dotnet build` to build the application.

## running the website
Finally, to run the website in development mode use `dotnet watch` in the apps/web directory & the website should build and run with hot reload enabled, if you do not want this functionality use `dotnet run` also in the apps/web directory.

## running tests
To run tests, you must first start the server with `dotnet run` (see above) and then navigate to tests/PlaywrightTests in another shell and run `dotnet test`.
