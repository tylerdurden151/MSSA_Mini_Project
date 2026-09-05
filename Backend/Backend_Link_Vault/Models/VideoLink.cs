namespace Backend_Link_Vault.Models;

public class VideoLink
{
    // The unique identifier for the video link
    public Guid Id { get; set; }

    // The unique identifier of the user who owns this video link
    public Guid UserId { get; set; }

    public string Url { get; set; } = string.Empty;

    // The platform of the video link (e.g., TikTok, YouTube, Instagram, Facebook)
    public Platform Platform { get; set; }

    // The title of the video link, if available
    public string? Title { get; set; }
    public string? ThumbnailUrl { get; set; }

    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();

    public DateTime CreatedAtUtc { get; set; }
}
