import "./LinkCard.css";

function formatAdded(isoDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - new Date(isoDate)) / msPerDay);

  if (days <= 0) return "Added today";
  if (days === 1) return "Added yesterday";
  return `Added ${days}d ago`;
}

function LinkCard({ link }) {
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
