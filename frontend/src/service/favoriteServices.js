const BASE_URL = "http://localhost:8080/api/favorites";

export async function getFavoriteNotes() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export async function toggleFavorite(id) {
  const response = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function addToFavorites(id) {
  const response = await fetch(`${BASE_URL}/${id}/add`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function removeFromFavorites(id) {
  const response = await fetch(`${BASE_URL}/${id}/remove`, {
    method: 'PATCH',
  });
  return response.json();
}
