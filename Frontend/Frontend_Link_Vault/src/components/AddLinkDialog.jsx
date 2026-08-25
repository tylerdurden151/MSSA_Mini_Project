import { useState } from "react";
import "./AddLinkDialog.css";

// Guess the platform from the URL itself, same rule the real capstone's
// oEmbed step will eventually replace. Falls back to "Unknown".
function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes("tiktok")) return "TikTok";
  if (u.includes("youtube") || u.includes("youtu.be")) return "YouTube";
  if (u.includes("instagram")) return "Instagram";
  if (u.includes("facebook") || u.includes("fb.watch")) return "Facebook";
  return "Unknown";
}

function AddLinkDialog({
  platforms,
  categoryOptions,
  defaultCategory,
  onAdd,
  onClose,
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  // null = "not overridden yet" -> follow whatever detectPlatform(url) says
  const [platformOverride, setPlatformOverride] = useState(null);
  const [category, setCategory] = useState(defaultCategory);

  const detected = detectPlatform(url);
  const platform = platformOverride ?? detected;

  function submit() {
    if (url.trim() === "") return;

    const cleanTags = [
      ...new Set(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      ),
    ];

    onAdd({
      id: crypto.randomUUID(),
      url: url.trim(),
      platform,
      title: title.trim() || `Untitled ${platform} link`,
      thumbnailUrl: null,
      category,
      tags: cleanTags,
      createdAtUtc: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div
      className="dialog-backdrop"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-link-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="dialog-title" id="add-link-title">
          Add a link
        </h2>

        <div className="dialog-body">
          <label className="field">
            URL
            <input
              className="input"
              autoFocus
              placeholder="https://tiktok.com/@user/video/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>

          <label className="field">
            Title
            <input
              className="input"
              placeholder="Optional — shown on the card"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="field">
            Platform
            <div className="seg">
              {platforms.map((p) => (
                <label
                  key={p}
                  className={
                    p === platform ? "seg-opt seg-opt-active" : "seg-opt"
                  }
                >
                  <input
                    type="radio"
                    name="platform"
                    checked={p === platform}
                    onChange={() => setPlatformOverride(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <label className="field">
            Category
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Tags
            <input
              className="input"
              placeholder="comma separated, e.g. recipe, quick"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
        </div>

        <div className="dialog-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit}>
            Add link
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLinkDialog;
