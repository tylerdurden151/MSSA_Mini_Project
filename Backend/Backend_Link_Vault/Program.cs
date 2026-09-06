using Backend_Link_Vault.Models;
using Backend_Link_Vault.Services;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Platform (an enum) serializes/deserializes as its string name
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

//CORS policy for allowing requests from the frontend development server
const string FrontendCorsPolicy = "FrontendDev";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

//One shared in-memory user store for the application
builder.Services.AddSingleton<UserStore>();

//One shared in-memory video link store for the application
builder.Services.AddSingleton<VideoLinkStore>();

//Password hasher for hashing and verifying passwords
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

var app = builder.Build();

//preloaded data for testing
// Seed one known demo account on every startup, so it's available to log
// in with immediately — without needing to register it again after every
// restart, since UserStore/VideoLinkStore are in-memory and wipe on restart.
using (var scope = app.Services.CreateScope())
{
    var userStore = scope.ServiceProvider.GetRequiredService<UserStore>();
    var videoLinkStore = scope.ServiceProvider.GetRequiredService<VideoLinkStore>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

    var demoUser = new User
    {
        FirstName = "Timothy",
        LastName = "Eckart",
        Email = "timothy@example.com",
    };
    demoUser.PasswordHash = passwordHasher.HashPassword(demoUser, "video123");

    userStore.Add(demoUser);
    videoLinkStore.SeedDemoData(demoUser.Id);
}

app.UseHttpsRedirection();

// Enable the CORS policy
app.UseCors(FrontendCorsPolicy);

app.MapControllers();

app.Run();
