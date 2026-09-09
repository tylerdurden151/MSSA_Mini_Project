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

    //IEnumerable when it returns data, that data will be a sequence/collection of VideoLink objects
    [HttpGet("{userId}")]
    public ActionResult<IEnumerable<VideoLink>> GetForUser(Guid userId)
    {
        if (!UserExists(userId))
        {
            return NotFound("No account with that id.");
        }

        return Ok(_videoLinkStore.GetForUser(userId));
    }

    // The Create method is an HTTP POST endpoint that allows the creation of a new video link for a specific user.
    // It takes a userId and a CreateVideoLinkRequest object as parameters.
    // The method first checks if the user exists; if not, it returns a 404 Not Found response.
    // If the user exists, it creates a new VideoLink object with the provided data, adds it to the VideoLinkStore, and returns the created link with a 200 OK response.
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

    //helper method to check if a user exists in the UserStore by their userId.
    //It returns true if the user is found, otherwise false.
    private bool UserExists(Guid userId) => _userStore.FindById(userId) is not null;
}
