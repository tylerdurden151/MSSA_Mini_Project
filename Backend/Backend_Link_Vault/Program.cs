using Microsoft.AspNetCore.Identity;
using Backend_Link_Vault.Models;
using Backend_Link_Vault.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//One shared in-memory user store for the application
builder.Services.AddSingleton<UserStore>();

//Password hasher for hashing and verifying passwords
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

var app = builder.Build();

app.UseHttpsRedirection();


app.MapControllers();

app.Run();
