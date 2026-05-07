import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/generos`;

export const getGeneros = async () => {
  const res = await axios.get(URL);
  return res.data;
};

export const createGenero = async (data) => {
  const res = await axios.post(URL, data);
  return res.data;
};

export const updateGenero = async (id, data) => {
  const res = await axios.put(`${URL}/${id}`, data);
  return res.data;
};

export const deleteGenero = async (id) => {
  return await axios.delete(`${URL}/${id}`);
};