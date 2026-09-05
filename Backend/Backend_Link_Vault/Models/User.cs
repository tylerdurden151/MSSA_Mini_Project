using System;

namespace Backend_Link_Vault.Models;

public class User
{
	private string _email; 
	public Guid Id { get; set; }
	public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email
    {
        get
        {
            return _email;
        }

        set
        {
            // Requirement #1: Email cannot be empty
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Email is required.");
            }

            // Requirement #2: Email must contain @
            if (!value.Contains('@'))
            {
                throw new ArgumentException(
                    "Email must contain an @ sign.");
            }

            // Requirement #3: Email cannot be changed after being set
            if (!string.IsNullOrEmpty(_email))
            {
                throw new InvalidOperationException(
                    "Email cannot be changed once set.");
            }

            _email = value;
        }
    }
    public string PasswordHash { get; set; } = string.Empty;
}
