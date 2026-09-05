namespace Backend_Link_Vault.DTO;

//This is whats going back to the user when they request their user information. It is a DTO that is used to transfer data between the server and the client.
public class UserResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    //NO PASSWORDHASH HERE. This is a security risk and should not be sent to the client.
}
