using System.ComponentModel.DataAnnotations;
using Backend_Link_Vault.Models;

namespace Backend_Link_Vault.DTO;

public class CreateVideoLinkRequest
{
    [Required]
    [Url]
    public string Url { get; set; } = string.Empty;

    // Nullable enum, not plain Platform: [Required] on a non-nullable value
    // type is a known no-op (a missing "platform" field would just silently
    // bind to the enum's default value, TikTok, instead of failing
    // validation). Making it nullable is what lets [Required] actually catch
    // a client that forgot to send it.
    [Required]
    public Platform? Platform { get; set; }

    [MaxLength(200)]
    public string? Title { get; set; }

    public string? ThumbnailUrl { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();
}
