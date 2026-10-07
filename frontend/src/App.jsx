import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cantidadRecarga, setCantidadRecarga] = useState(5); // Valor por defecto para cargar

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

  // Usamos la misma función Serverless para VENDER (negativo) y RECARGAR (positivo)
  const modificarStock = async (cantidad) => {
    setLoading(true);

    const { data, error } = await supabase.functions.invoke(
      "actualizar-stock",
      {
        body: { producto_id: "P01", cantidad_cambio: cantidad },
      },
    );

    if (data && data.success) {
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
          width: "400px",
        }}
      >
        <h2 style={{ margin: "0 0 5px 0" }}>📦 Panel de Inventario</h2>
        <p style={{ fontSize: "16px", color: "#888", margin: "0 0 20px 0" }}>
          Sucursal Central
        </p>

        <p style={{ fontSize: "18px", color: "#ccc", margin: 0 }}>
          Teclado Mecánico (ID: P01)
        </p>

        <div style={{ fontSize: "64px", fontWeight: "bold", margin: "15px 0" }}>
          {stock !== null ? stock : "..."}
        </div>

        <p
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: stock < 3 ? "#ff4d4d" : "#4dff4d",
            marginBottom: "30px",
          }}
        >
          {stock < 3
            ? "⚠️ ALERTA: Stock Crítico (< 3)"
            : "✅ Nivel de stock estable"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* SECCIÓN VENTA */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <p
              style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#aaa" }}
            >
              Salida de mercadería
            </p>
            <button
              onClick={() => modificarStock(-1)}
              disabled={loading || stock <= 0}
              style={{
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: loading || stock <= 0 ? "#555" : "#e63946",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading || stock <= 0 ? "not-allowed" : "pointer",
                width: "100%",
              }}
            >
              📉 Registrar Venta (-1)
            </button>
          </div>

          {/* SECCIÓN INGRESO DE STOCK */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <p
              style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#aaa" }}
            >
              Ingreso de proveedores
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                value={cantidadRecarga}
                onChange={(e) => setCantidadRecarga(Number(e.target.value))}
                min="1"
                style={{
                  width: "70px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              />
              <button
                onClick={() => modificarStock(cantidadRecarga)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: loading ? "#555" : "#2a9d8f",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                📦 Cargar Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
