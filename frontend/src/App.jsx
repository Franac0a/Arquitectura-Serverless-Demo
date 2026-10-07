import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [stock, setStock] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cantidadRecarga, setCantidadRecarga] = useState(5)

  // Consultar el stock actual al cargar la página
  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await supabase
        .from('productos')
        .select('stock')
        .eq('id', 'P01')
        .single()
      
      if (data) setStock(data.stock)
    }

    fetchStock()
  }, [])

  // Misma función Serverless para VENDER (negativo) y RECARGAR (positivo)
  const modificarStock = async (cantidad) => {
    setLoading(true)
    
    const { data, error } = await supabase.functions.invoke('actualizar-stock', {
      body: { producto_id: 'P01', cantidad_cambio: cantidad }
    })

    if (data && data.success) {
      setStock(data.producto[0].stock) 
    } else {
      console.error("Error al actualizar:", error)
    }
    
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="title"> Panel de Inventario</h2>
        <p className="subtitle">Sucursal Central</p>
        
        <p className="product-name">Teclado Mecánico (ID: P01)</p>
        
        <div className="stock-display">
          {stock !== null ? stock : '...'}
        </div>
        
        <p className={`status-alert ${stock !== null && stock < 3 ? 'critical' : 'stable'}`}>
          {stock !== null && stock < 3 ? ' ALERTA: Stock Crítico (< 3)' : ' Nivel de stock estable'}
        </p>

        <div className="actions-group">
          
          {/* SECCIÓN VENTA */}
          <div className="action-card">
            <p className="action-label">Salida de mercadería</p>
            <button 
              onClick={() => modificarStock(-1)} 
              disabled={loading || stock <= 0}
              className="btn btn-sell"
            >
               Registrar Venta (-1)
            </button>
          </div>

          {/* SECCIÓN INGRESO DE STOCK */}
          <div className="action-card">
            <p className="action-label">Ingreso de proveedores</p>
            <div className="input-row">
              <input 
                type="number" 
                value={cantidadRecarga} 
                onChange={(e) => setCantidadRecarga(Number(e.target.value))}
                min="1"
                className="input-number"
              />
              <button 
                onClick={() => modificarStock(cantidadRecarga)} 
                disabled={loading}
                className="btn btn-restock"
              >
                 Cargar Stock
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App