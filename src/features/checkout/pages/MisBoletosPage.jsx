import { useState, useEffect } from "react";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { getMisBoletos } from "../api/checkoutApi";

const MisBoletosPage = () => {
  const user = useCurrentUser();
  const [boletos, setBoletos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getMisBoletos(user.idUsuario)
        .then(setBoletos)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (isLoading) return <div style={{ padding: "100px", color: "var(--color-text)", textAlign: "center" }}>Cargando boletos...</div>;

  return (
    <div style={{ padding: "40px", color: "var(--color-text)", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--color-primary)", marginBottom: "40px", textAlign: "center" }}>Mis Boletos</h1>

      {boletos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", background: "var(--color-surface)", borderRadius: "15px" }}>
          <h2>No tienes boletos comprados aún.</h2>
          <p style={{ color: "var(--color-muted)", marginTop: "10px" }}>¡Ve a la cartelera y disfruta de una película!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {boletos.map(b => (
            <div key={b.idBoleto} style={{
              background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%)",
              border: "1px solid var(--color-primary)",
              borderRadius: "15px",
              padding: "20px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, background: "var(--color-secondary)", color: "#000", padding: "5px 15px", fontWeight: "bold", borderBottomLeftRadius: "10px" }}>
                #{b.idBoleto}
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--color-primary)", paddingRight: "50px" }}>{b.nombrePelicula}</h3>
              <p style={{ marginBottom: "8px" }}><strong>Sala:</strong> {b.numeroSala}</p>
              <p style={{ marginBottom: "8px" }}><strong>Asiento:</strong> {b.fila}{b.numeroAsiento}</p>
              <p style={{ marginBottom: "8px" }}><strong>Fecha:</strong> {b.fecha}</p>
              <p style={{ marginBottom: "8px" }}><strong>Hora:</strong> {b.hora}</p>
              <p style={{ marginTop: "15px", color: "var(--color-secondary)", fontSize: "1.2rem", fontWeight: "bold" }}>Q{b.precio.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisBoletosPage;
