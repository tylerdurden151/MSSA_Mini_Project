using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend_Link_Vault.Models;
using Backend_Link_Vault.DTO;
using Backend_Link_Vault.Services;

namespace Backend_Link_Vault.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserStore _userStore;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly VideoLinkStore _videoLinkStore;

    // Hardcoded on purpose, not configuration: this is the one demo account
    // Every other account starts genuinely empty.
    private const string DemoAccountEmail = "timothy@example.com";

    public AuthController(UserStore userStore, IPasswordHasher<User> passwordHasher, VideoLinkStore videoLinkStore)
    {
        _userStore = userStore;
        _passwordHasher = passwordHasher;
        _videoLinkStore = videoLinkStore;
    }

    [HttpPost("register")]
    public ActionResult<UserResponse> Register(RegisterRequest request)
    {
        if (_userStore.FindByEmail(request.Email) is not null)
        {
            return Conflict("An account with that email already exists.");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
        };

        // Hash before the user ever reaches storage. HashPassword takes the
        // user object for context (some hashers factor in user data), not
        // because it reads PasswordHash — that's what we're about to set.
        user.PasswordHash = _passwordHasher.HashPassword(user, request.PasswordHash);

        _userStore.Add(user);

        if (string.Equals(user.Email, DemoAccountEmail, StringComparison.OrdinalIgnoreCase))
        {
            _videoLinkStore.SeedDemoData(user.Id);
        }
        return Ok(ToResponse(user));
    }

    [HttpPost("login")]
    public ActionResult<UserResponse> Login(LoginRequest request)
    {
        var user = _userStore.FindByEmail(request.Email);

        // Same generic error whether the email doesn't exist or the password
        // is wrong — telling them apart would let someone probe which
        // emails have accounts (user enumeration).
        if (user is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user, user.PasswordHash, request.PasswordHash);

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(ToResponse(user));
    }

    private static UserResponse ToResponse(User user) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
    };
}
