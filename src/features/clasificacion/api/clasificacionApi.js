import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/clasificaciones`;

export const getClasificaciones = async () => {
  const res = await axios.get(URL);
  return res.data;
};

export const createClasificacion = async (data) => {
  const res = await axios.post(URL, data);
  return res.data;
};

export const updateClasificacion = async (id, data) => {
  const res = await axios.put(`${URL}/${id}`, data);
  return res.data;
};

export const deleteClasificacion = async (id) => {
  return await axios.delete(`${URL}/${id}`);
};