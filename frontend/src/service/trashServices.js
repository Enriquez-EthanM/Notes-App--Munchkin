const BASE_URL = "http://localhost:8080/api/trash";

export async function getTrashedNotes() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export async function moveToTrash(id) {
  const response = await fetch(`${BASE_URL}/${id}/trash`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function restoreFromTrash(id) {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function permanentlyDelete(id) {
  const response = await fetch(`${BASE_URL}/${id}/permanent`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function emptyTrash() {
  const response = await fetch(`${BASE_URL}/empty`, {
    method: 'DELETE',
  });
  return response.ok;
}
