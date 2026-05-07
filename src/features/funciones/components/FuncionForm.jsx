import { useState } from "react";

const FuncionForm = ({ onSubmit, peliculas, salas }) => {

  const initialState = {
    idPelicula: "",
    idSala: "",
    fecha: "",
    hora: "",
  };

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 RESET FORM
  const resetForm = () => {
    setForm(initialState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      idPelicula: form.idPelicula,
      idSala: form.idSala,
      fechaHora: `${form.fecha}T${form.hora}:00`
    };

    onSubmit(payload, resetForm); // 🔥 IMPORTANTE
  };

  return (
    <form className="funcion-form" onSubmit={handleSubmit}>

      <select name="idPelicula" value={form.idPelicula} onChange={handleChange}>
        <option value="">Película</option>
        {peliculas.map(p => (
          <option key={p.idPelicula} value={p.idPelicula}>
            {p.nombre}
          </option>
        ))}
      </select>

      <select name="idSala" value={form.idSala} onChange={handleChange}>
        <option value="">Sala</option>
        {salas.map(s => (
          <option key={s.idSala} value={s.idSala}>
            Sala {s.numeroSala}
          </option>
        ))}
      </select>

      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />

      <input type="time" name="hora" value={form.hora} onChange={handleChange} />

      <button type="submit">Crear Función</button>

    </form>
  );
};

export default FuncionForm;