using System;
using Backend_Link_Vault.Models;
namespace Backend_Link_Vault.Services;

public class UserStore
{
    private readonly List<User> _users = new List<User>();

    public User? FindByEmail(string email)
    {
        //LINQ query to find the user by email, ignoring case sensitivity
        //used Built in method FirstOrDefault to return the first user that matches the email or null if no user is found
        //From _users
        //Where u.Email == email, ignoring case sensitivity
        //Select u
        return _users.FirstOrDefault(u =>
            string.Equals(
                u.Email,
                email,
                StringComparison.OrdinalIgnoreCase));
    }

    public User? FindById(Guid id)
    {
        //LINQ query to find the user by Id
        //From _users
        //Where u.Id == id
        //Select u
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
