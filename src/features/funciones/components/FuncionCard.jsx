const FuncionCard = ({ funcion, onDelete }) => {

  // 🔥 formatea hora bonita
  const formatHora = (hora) => {
    if (!hora) return "";

    // Si la hora viene en formato "HH:MM:SS"
    if (typeof hora === "string" && hora.length >= 5) {
      return hora.substring(0, 5);
    }

    // fallback por si viene LocalDateTime
    const date = new Date(hora);
    if (!isNaN(date)) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return hora;
  };

  const [fecha, horaStr] = funcion.fechaHora ? funcion.fechaHora.split('T') : ["", ""];

  return (
    <div className="funcion-card">

      <img
        src={funcion.poster}
        alt={funcion.nombrePelicula}
        className="poster"
      />

      <div className="info">

        <h3>{funcion.nombrePelicula}</h3>

        <p> Sala: {funcion.numeroSala}</p>

        <p> Fecha: {fecha}</p>
        <p> Hora: {formatHora(horaStr)}</p>

        <button onClick={() => onDelete(funcion.idFuncion)}>
          Eliminar
        </button>

      </div>
    </div>
  );
};

export default FuncionCard;