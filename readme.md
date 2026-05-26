# Setup Instructions 

## Requirements
To run this website you require
- dotnet SDK v10.0.104 or newer (some older versions may work)
- Some OS's or linux distrobutions may require other ASP.NET external packages
- A postgreSQL database

## Installing dependencies (optional)
Usually this is not a requirement. However, if there are any issues try to run `dotnet restore` in the root of the repository

## building
To build the application, go to the root directory (or web, both work) & run `dotnet build` to build the application

## migrating database
Ensure the `ASPNETCORE_ENVIRONMENT=Development` and `ConnectionStrings__PostgreSQL='Host=localhost;Port=5432;Database=dev;Username=postgres;Password=password;Include Error Detail=true'` environment variables are set in your shell environment.
from the root of the project, run `dotnet ef database update --project utils/Database --startup-project apps/Web`

## running the website
Finally, to run the website run `dotnet watch` in the apps/web directory & the website should build and run.