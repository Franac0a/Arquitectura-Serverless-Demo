import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  // Consultar el stock actual al cargar la página
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    const { data } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", "P01")
      .single();

    if (data) setStock(data.stock);
  };

  // Disparar la función Serverless al hacer clic
  const registrarVenta = async () => {
    setLoading(true);

    const { data, error } = await supabase.functions.invoke(
      "actualizar-stock",
      {
        body: { producto_id: "P01", cantidad_cambio: -1 },
      },
    );

    if (data && data.success) {
      // La función devuelve el producto actualizado en un array
      setStock(data.producto[0].stock);
    } else {
      console.error("Error al actualizar:", error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          padding: "30px",
          border: "1px solid #444",
          borderRadius: "12px",
          textAlign: "center",
          backgroundColor: "#1a1a1a",
          color: "white",
          width: "350px",
        }}
      >
        <h2 style={{ margin: "0 0 20px 0" }}>Teclado Mecánico</h2>

        <p style={{ fontSize: "18px", color: "#ccc" }}>ID del Producto: P01</p>

        <div style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
          {stock !== null ? stock : "..."}
        </div>

        <p
          style={{
            fontWeight: "bold",
            color: stock < 3 ? "#ff4d4d" : "#4dff4d",
          }}
        >
          {stock < 3 ? "⚠️ Alerta: Stock crítico" : "✅ Stock estable"}
        </p>

        <button
          onClick={registrarVenta}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: loading ? "#555" : "#646cff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {loading ? "Procesando en Serverless..." : "Vender 1 unidad"}
        </button>
      </div>
    </div>
  );
}

export default App;
