import "./LinkCard.css";

function formatAdded(isoDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - new Date(isoDate)) / msPerDay);

  if (days <= 0) return "Added today";
  if (days === 1) return "Added yesterday";
  return `Added ${days}d ago`;
}

function LinkCard({ link, onDelete }) {
  return (
    <article className="card">
      <div className="card-thumb">
        {link.thumbnailUrl ? (
          <img className="card-img" src={link.thumbnailUrl} alt="" />
        ) : (
          <svg className="card-play" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5l12 7-12 7z" fill="currentColor" />
          </svg>
        )}
        <span className="card-platform">{link.platform}</span>

        <button
          className="card-delete"
          aria-label={`Delete ${link.title}`}
          onClick={() => onDelete(link.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 6h16M9 6V4h6v2M7 6l1 14h8l1-14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{link.title}</h3>

        <div className="card-tags">
          {link.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="card-meta">{formatAdded(link.createdAtUtc)}</p>
      </div>
    </article>
  );
}

export default LinkCard;
