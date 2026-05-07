const BASE_URL = `${import.meta.env.VITE_API_URL}/salas`;

export const getSalas = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const getAsientosBySala = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/asientos`);
  return res.json();
};

export const createSala = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteSala = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};