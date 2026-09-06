using System.ComponentModel.DataAnnotations;
using Backend_Link_Vault.Models;

namespace Backend_Link_Vault.DTO;

public class CreateVideoLinkRequest
{
    [Required]
    [Url]
    public string Url { get; set; } = string.Empty;


    [Required]
    public Platform? Platform { get; set; }

    [MaxLength(200)]
    public string? Title { get; set; }

    public string? ThumbnailUrl { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();
}
