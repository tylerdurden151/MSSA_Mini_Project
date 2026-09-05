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

//One shared in-memory user store for the application
builder.Services.AddSingleton<UserStore>();

//One shared in-memory video link store for the application
builder.Services.AddSingleton<VideoLinkStore>();

//Password hasher for hashing and verifying passwords
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

var app = builder.Build();

app.UseHttpsRedirection();


app.MapControllers();

app.Run();
