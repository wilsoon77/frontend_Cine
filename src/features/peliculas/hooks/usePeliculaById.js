import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePeliculaById = (id) => {
  return useQuery({
    queryKey: ["pelicula", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/peliculas/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};