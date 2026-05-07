import { useState, useEffect } from "react";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { getMetodosPago, procesarCompra } from "../api/checkoutApi";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const user = useCurrentUser();
  const [checkoutData, setCheckoutData] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [idMetodoPago, setIdMetodoPago] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("checkout_data");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }

    getMetodosPago().then(setMetodosPago).catch(console.error);
  }, []);

  if (!checkoutData) return null;

  const { pelicula, funcion, asientos } = checkoutData;
  const precioPorBoleto = 50; // Precio fijo para prueba
  const total = asientos.length * precioPorBoleto;

  const handlePagar = async () => {
    if (!idMetodoPago) {
      Swal.fire("Atención", "Debes seleccionar un método de pago", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      await procesarCompra({
        idUsuario: user.idUsuario,
        idMetodoPago: Number(idMetodoPago),
        idAsientos: asientos,
        idFuncion: funcion.idFuncion,
        total: total
      });

      Swal.fire("¡Compra Exitosa!", "Tus boletos han sido generados", "success").then(() => {
        localStorage.removeItem("checkout_data");
        window.history.pushState({}, "", "/mis-boletos");
        window.dispatchEvent(new Event("popstate"));
      });
    } catch (error) {
      console.error("Error compra:", error?.response?.data || error);
      const msg = error?.response?.data || "No se pudo procesar la compra";
      Swal.fire("Error", String(msg), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "40px", color: "var(--color-text)", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--color-primary)", textAlign: "center", marginBottom: "40px" }}>Resumen de Compra</h1>

      <div style={{ background: "var(--color-surface)", padding: "30px", borderRadius: "15px", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "20px", color: "var(--color-secondary)" }}>{pelicula.nombre}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "1.1rem" }}>
          <p><strong>Función:</strong> Sala {funcion.numeroSala}</p>
          <p><strong>Fecha:</strong> {funcion.fechaHora ? funcion.fechaHora.split('T')[0] : ''} a las {funcion.fechaHora ? funcion.fechaHora.split('T')[1].substring(0,5) : ''}</p>
          <p><strong>Boletos:</strong> {asientos.length}</p>
          <p><strong>Precio unitario:</strong> Q{precioPorBoleto.toFixed(2)}</p>
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.5rem" }}>Total a Pagar:</h3>
          <h3 style={{ fontSize: "2rem", color: "var(--color-primary)" }}>Q{total.toFixed(2)}</h3>
        </div>
      </div>

      <div style={{ background: "var(--color-surface)", padding: "30px", borderRadius: "15px", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "20px" }}>Método de Pago</h3>
        <select
          value={idMetodoPago}
          onChange={(e) => setIdMetodoPago(e.target.value)}
          style={{ width: "100%", padding: "15px", background: "var(--color-input-bg)", color: "var(--color-input-text)", border: "1px solid var(--color-primary)", borderRadius: "8px", fontSize: "1.1rem" }}
        >
          <option value="">Seleccione un método...</option>
          {metodosPago.map(mp => (
            <option key={mp.idMetodoPago} value={mp.idMetodoPago}>{mp.nombre}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePagar}
        disabled={isProcessing}
        className="btn-royale btn-primary"
        style={{ width: "100%", padding: "20px", fontSize: "1.3rem" }}
      >
        {isProcessing ? "Procesando pago..." : "Confirmar y Pagar"}
      </button>
    </div>
  );
};

export default CheckoutPage;
