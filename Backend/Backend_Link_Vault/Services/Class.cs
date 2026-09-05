using Backend_Link_Vault.Models;

namespace Backend_Link_Vault.Services;

// Singleton, in-memory — same pattern as UserStore, same caveat: this
// resets to empty every time the app restarts. No persistence until the
// Postgres phase.
public class VideoLinkStore
{
    private readonly List<VideoLink> _links = new();

    public IReadOnlyList<VideoLink> GetForUser(Guid userId)
    {
        return _links.Where(l => l.UserId == userId).ToList().AsReadOnly();
    }

    public VideoLink Add(VideoLink link)
    {
        link.Id = Guid.NewGuid();
        _links.Add(link);
        return link;
    }

    // Returns false (rather than throwing) when there's nothing to delete,
    // so the controller can turn that into a plain 404 instead of a 500.
    // Scoped to userId as well as linkId so one account can never delete
    // another account's link just by guessing its id.
    public bool Delete(Guid userId, Guid linkId)
    {
        var link = _links.FirstOrDefault(l => l.Id == linkId && l.UserId == userId);
        if (link is null) return false;

        _links.Remove(link);
        return true;
    }

    // Ported directly from the frontend's mockData/mockLinks.js so the demo
    // account's seeded vault looks identical to what the frontend used to
    // fake client-side. Only ever called once, right after that one
    // hardcoded demo account registers — see AuthController.
    public void SeedDemoData(Guid userId)
    {
        DateTime DaysAgo(int n) => DateTime.UtcNow.AddDays(-n);

        var seed = new List<VideoLink>
        {
            new() { UserId = userId, Url = "https://www.tiktok.com/@chef/video/1111111111", Platform = Platform.TikTok, Title = "15-minute weeknight pasta", Category = "Cooking", Tags = new() { "recipe", "quick" }, CreatedAtUtc = DaysAgo(1) },
            new() { UserId = userId, Url = "https://www.youtube.com/watch?v=2222222222", Platform = Platform.YouTube, Title = "Building a deck in React — full walkthrough", Category = "Learning", Tags = new() { "tutorial", "react" }, CreatedAtUtc = DaysAgo(3) },
            new() { UserId = userId, Url = "https://www.instagram.com/reel/3333333333/", Platform = Platform.Instagram, Title = "Studio apartment tour, 400 sq ft", Category = "Home", Tags = new() { "home" }, CreatedAtUtc = DaysAgo(6) },
            new() { UserId = userId, Url = "https://www.facebook.com/reel/4444444444", Platform = Platform.Facebook, Title = "Neighborhood block party highlights", Category = "Home", Tags = new() { "community" }, CreatedAtUtc = DaysAgo(9) },
            new() { UserId = userId, Url = "https://www.tiktok.com/@runner/video/5555555555", Platform = Platform.TikTok, Title = "Couch to 5K, week one recap", Category = "Fitness", Tags = new() { "fitness", "running" }, CreatedAtUtc = DaysAgo(12) },
            new() { UserId = userId, Url = "https://www.youtube.com/watch?v=6666666666", Platform = Platform.YouTube, Title = "Ambient mix for deep work", Category = "Music", Tags = new() { "music", "focus" }, CreatedAtUtc = DaysAgo(15) },
            new() { UserId = userId, Url = "https://www.instagram.com/reel/7777777777/", Platform = Platform.Instagram, Title = "Three-day Lisbon itinerary", Category = "Travel", Tags = new() { "travel" }, CreatedAtUtc = DaysAgo(20) },
            new() { UserId = userId, Url = "https://www.tiktok.com/@office/video/8888888888", Platform = Platform.TikTok, Title = "Office small talk, ranked", Category = "Humor", Tags = new() { "comedy" }, CreatedAtUtc = DaysAgo(24) },
            new() { UserId = userId, Url = "https://www.youtube.com/watch?v=9999999999", Platform = Platform.YouTube, Title = "Sourdough starter, day by day", Category = "Cooking", Tags = new() { "recipe", "baking" }, CreatedAtUtc = DaysAgo(40) },
            new() { UserId = userId, Url = "https://www.instagram.com/reel/1010101010/", Platform = Platform.Instagram, Title = "Azure deployment in five minutes", Category = "Learning", Tags = new() { "tutorial", "cloud" }, CreatedAtUtc = DaysAgo(55) },
        };

        foreach (var link in seed)
        {
            link.Id = Guid.NewGuid();
        }

        _links.AddRange(seed);
    }
}
