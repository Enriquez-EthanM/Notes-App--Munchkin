import "./css/Trash.css";

function Trash({ notes, restoreNote, purgeNote }) {
  return (
    <div className="trash-page">
      <h2>Recently Deleted</h2>
      {notes.length === 0 ? (
        <p className="empty">Nothing here. Deleted notes will show up for restore.</p>
      ) : (
        <ul className="trash-list">
          {notes.map(n => (
            <li key={n.id} className="trash-item">
              <div className="meta">
                <h4>{n.title}</h4>
                <p>{n.content}</p>
              </div>
              <div className="actions">
                <button className="restore" onClick={() => restoreNote(n.id)}>Restore</button>
                <button className="purge" onClick={() => purgeNote(n.id)}>Delete forever</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Trash; 