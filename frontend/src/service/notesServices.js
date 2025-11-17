const BASE_URL = "http://localhost:8080/api/notes"
//mga banga way connect2 sa backend or database
//-ethan
export async function getNotes() {
  const res = await fetch("http://localhost:8080/api/notes");
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export const createNote = async (note) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });
    return response.json();
}

export const updateNote = async (id, note) => {
    const response = await fetch (`${BASE_URL}/${id}`, {
        method:"PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(note),
    });
    return await response.json();
}

export const deleteNote = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
    return response.ok;
}