import { useState, useEffect } from "react";
import { usePeliculaById } from "../../peliculas/hooks/usePeliculaById";
import { getFuncionesPorPelicula, getEstadoAsientos } from "../api/funcionApi";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import Swal from "sweetalert2";

const PeliculaDetallePage = () => {
  const user = useCurrentUser();
  const pathParts = window.location.pathname.split("/");
  const idPelicula = pathParts[pathParts.length - 1];

  const { data: pelicula, isLoading: isLoadingPelicula } = usePeliculaById(idPelicula);
  const [funciones, setFunciones] = useState([]);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  useEffect(() => {
    if (idPelicula) {
      getFuncionesPorPelicula(idPelicula).then(setFunciones).catch(console.error);
    }
  }, [idPelicula]);

  const handleSelectFuncion = async (funcion) => {
    setFuncionSeleccionada(funcion);
    setAsientosSeleccionados([]);
    try {
      const asientosFuncion = await getEstadoAsientos(funcion.idFuncion);
      setAsientos(asientosFuncion);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los asientos", "error");
    }
  };

  const toggleAsiento = (asiento) => {
    if (asiento.estado !== "DISPONIBLE") return;

    if (asientosSeleccionados.includes(asiento.idAsiento)) {
      setAsientosSeleccionados(prev => prev.filter(id => id !== asiento.idAsiento));
    } else {
      setAsientosSeleccionados(prev => [...prev, asiento.idAsiento]);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      Swal.fire("Atención", "Debes iniciar sesión para comprar boletos", "warning");
      // window.history.pushState({}, "", "/login");
      // window.dispatchEvent(new Event("popstate"));
      return;
    }
    
    if (asientosSeleccionados.length === 0) {
      Swal.fire("Atención", "Debes seleccionar al menos un asiento", "warning");
      return;
    }

    // Save to local storage for checkout page
    localStorage.setItem("checkout_data", JSON.stringify({
      pelicula,
      funcion: funcionSeleccionada,
      asientos: asientosSeleccionados
    }));

    window.history.pushState({}, "", "/checkout");
    window.dispatchEvent(new Event("popstate"));
  };

  if (isLoadingPelicula) return <div style={{padding: "100px", color: "var(--color-text)"}}>Cargando...</div>;
  if (!pelicula) return <div style={{padding: "100px", color: "var(--color-text)"}}>Película no encontrada</div>;

  return (
    <div style={{ padding: "40px", color: "var(--color-text)", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
        <img src={pelicula.poster} alt={pelicula.nombre} style={{ width: "300px", borderRadius: "10px", boxShadow: "0 0 20px rgba(0, 200, 255, 0.3)" }} />
        <div>
          <h1 style={{ fontSize: "3rem", color: "var(--color-primary)", marginBottom: "20px" }}>{pelicula.nombre}</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}><strong>Clasificación:</strong> {pelicula.clasificacion}</p>
          <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}><strong>Duración:</strong> {pelicula.duracion} min</p>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}><strong>Géneros:</strong> {pelicula.generos?.join(", ")}</p>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "var(--color-muted)" }}>{pelicula.descripcion}</p>
        </div>
      </div>

      <h2 style={{ color: "var(--color-secondary)", marginBottom: "20px" }}>Funciones Disponibles</h2>
      {funciones.length === 0 ? (
        <p>No hay funciones programadas para esta película.</p>
      ) : (
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "40px" }}>
          {funciones.map(f => (
            <button 
              key={f.idFuncion}
              onClick={() => handleSelectFuncion(f)}
              style={{
                padding: "15px 25px",
                background: funcionSeleccionada?.idFuncion === f.idFuncion ? "var(--color-primary)" : "var(--color-card-overlay)",
                color: funcionSeleccionada?.idFuncion === f.idFuncion ? "#000" : "var(--color-text)",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem",
                transition: "all 0.3s"
              }}
            >
              Sala {f.numeroSala} - {f.fechaHora ? f.fechaHora.split('T')[0] : ''} a las {f.fechaHora ? f.fechaHora.split('T')[1].substring(0,5) : ''}
            </button>
          ))}
        </div>
      )}

      {funcionSeleccionada && (
        <div style={{ background: "var(--color-surface)", padding: "30px", borderRadius: "10px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", color: "var(--color-primary)" }}>Selecciona tus Asientos</h2>
          
          <div style={{ background: "var(--color-surface-alt)", height: "10px", width: "80%", margin: "0 auto 40px", borderRadius: "10px", boxShadow: "0 4px 12px var(--color-primary-glow)" }}>
             <p style={{textAlign:"center", color:"var(--color-muted)", marginTop:"15px"}}>PANTALLA</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", maxWidth: "600px", margin: "0 auto" }}>
            {["A", "B", "C", "D"].map((fila) => {
              const asientosFila = asientos
                .filter((a) => a.fila === fila)
                .sort((a, b) => a.numero - b.numero);

              if (asientosFila.length === 0) return null;

              return (
                <div key={fila} style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {asientosFila.map(a => {
                    const isSelected = asientosSeleccionados.includes(a.idAsiento);
                    const isOcupado = a.estado === "OCUPADO";
                    
                    let bgColor = "var(--color-surface-alt)"; // Disponible
                    if (isSelected) bgColor = "var(--color-secondary)"; // Dorado
                    if (isOcupado) bgColor = "var(--color-danger)"; // Ocupado

                    return (
                      <div 
                        key={a.idAsiento}
                        onClick={() => toggleAsiento(a)}
                        style={{
                          width: "40px", 
                          height: "40px", 
                          background: bgColor,
                          borderRadius: "8px 8px 4px 4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: isOcupado ? "not-allowed" : "pointer",
                          fontWeight: "bold",
                          color: isOcupado ? "rgba(255,255,255,0.5)" : "var(--color-text)",
                          border: isSelected ? "2px solid white" : "none",
                          transition: "all 0.2s"
                        }}
                        title={`Fila ${a.fila} - Asiento ${a.numero}`}
                      >
                        {a.fila}{a.numero}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}><div style={{width:"20px",height:"20px",background:"var(--color-surface-alt)",borderRadius:"4px"}}></div> Disponible</div>
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}><div style={{width:"20px",height:"20px",background:"var(--color-secondary)",borderRadius:"4px"}}></div> Seleccionado</div>
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}><div style={{width:"20px",height:"20px",background:"var(--color-danger)",borderRadius:"4px"}}></div> Ocupado</div>
          </div>

          {asientosSeleccionados.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Has seleccionado {asientosSeleccionados.length} asiento(s)</p>
              <button 
                onClick={handleCheckout}
                className="btn-royale btn-primary"
                style={{ padding: "15px 40px", fontSize: "1.2rem" }}
              >
                Continuar al Pago
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeliculaDetallePage;
