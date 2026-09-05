using Microsoft.AspNetCore.Mvc;
using Backend_Link_Vault.DTO;
using Backend_Link_Vault.Models;
using Backend_Link_Vault.Services;

namespace Backend_Link_Vault.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideoLinksController : ControllerBase
{
    private readonly VideoLinkStore _videoLinkStore;
    private readonly UserStore _userStore;

    public VideoLinksController(VideoLinkStore videoLinkStore, UserStore userStore)
    {
        _videoLinkStore = videoLinkStore;
        _userStore = userStore;
    }


    [HttpGet("{userId}")]
    public ActionResult<IEnumerable<VideoLink>> GetForUser(Guid userId)
    {
        if (!UserExists(userId))
        {
            return NotFound("No account with that id.");
        }

        return Ok(_videoLinkStore.GetForUser(userId));
    }

    [HttpPost("{userId}")]
    public ActionResult<VideoLink> Create(Guid userId, CreateVideoLinkRequest request)
    {
        if (!UserExists(userId))
        {
            return NotFound("No account with that id.");
        }

        var link = new VideoLink
        {
            UserId = userId,
            Url = request.Url,
            Platform = request.Platform!.Value, // non-null: [Required] already enforced this before the handler runs
            Title = request.Title,
            ThumbnailUrl = request.ThumbnailUrl,
            Category = request.Category,
            Tags = request.Tags,
            CreatedAtUtc = DateTime.UtcNow,
        };

        _videoLinkStore.Add(link);

        return Ok(link);
    }

    [HttpDelete("{userId}/{linkId}")]
    public IActionResult Delete(Guid userId, Guid linkId)
    {
        if (!UserExists(userId))
        {
            return NotFound("No account with that id.");
        }

        var deleted = _videoLinkStore.Delete(userId, linkId);
        if (!deleted)
        {
            return NotFound("Link not found for this account.");
        }

        return NoContent();
    }

    private bool UserExists(Guid userId) => _userStore.FindById(userId) is not null;
}
