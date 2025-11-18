import { Link } from "react-router-dom";
import "./css/Dashboard.css";

function Dashboard({ notes, trashedNotes }) {
  const total = notes.length;
  const favorites = notes.filter(n => n.favorite).length;
  const deleted = trashedNotes.length;
  const recent = [...notes].slice(-3).reverse();

  return (
    <div className="dashboard">
      <section className="hero">
        <div className="hero-text">
          <h2>Welcome back 👋</h2>
          <p>Capture ideas fast and keep them beautifully organized.</p>
          <div className="hero-actions">
            <Link to="/notes" className="primary">Create a Note</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <Link to="/notes" className="stat" style={{ textDecoration: 'none' }}>
          <span className="label">Total Notes</span>
          <span className="value">{total}</span>
        </Link>
        <Link to="/favorites" className="stat" style={{ textDecoration: 'none' }}>
          <span className="label">Favorites</span>
          <span className="value">{favorites}</span>
        </Link>
        <Link to="/trash" className="stat" style={{ textDecoration: 'none' }}>
          <span className="label">Recently Deleted</span>
          <span className="value">{deleted}</span>
        </Link>
      </section>

      <section className="recent">
        <div className="recent-head">
          <h3>Recent Notes</h3>
          <Link to="/notes" className="see-all">See all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty">No recent notes. Create your first one.</p>
        ) : (
          <ul className="recent-list">
            {recent.map(n => (
              <li key={n.id} className="recent-item">
                <h4>{n.title}</h4>
                <p>{n.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard; 