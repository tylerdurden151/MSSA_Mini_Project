using System.ComponentModel.DataAnnotations;
namespace Backend_Link_Vault.DTO;
public class LoginRequest {

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
