using System;
using Backend_Link_Vault.Models;
namespace Backend_Link_Vault.Services;

public class UserStore
{
    private readonly List<User> _users = new List<User>();

    public User? FindByEmail(string email)
    {
        return _users.FirstOrDefault(u =>
            string.Equals(
                u.Email,
                email,
                StringComparison.OrdinalIgnoreCase));
    }

    public User? FindById(Guid id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }
    public User Add(User user)
    {
        user.Id = Guid.NewGuid();
        _users.Add(user);
        return user;
    }

    public IReadOnlyList<User> GetAllUsers()
    {
        return _users.AsReadOnly();
    }
}
