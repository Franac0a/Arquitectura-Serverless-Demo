import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// 1. Definir los permisos CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // 2. Responder al "preflight" (el chequeo de seguridad que hace el navegador)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { producto_id, cantidad_cambio } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: prod, error: fetchError } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", producto_id)
      .single();

    if (!prod) {
      return new Response(
        JSON.stringify({ error: "El producto no existe", detalle: fetchError }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const nuevo_stock = prod.stock + cantidad_cambio;

    const { data: updatedProd, error: updateError } = await supabase
      .from("productos")
      .update({ stock: nuevo_stock })
      .eq("id", producto_id)
      .select();

    if (updateError) throw updateError;

    // 3. Adjuntar las cabeceras CORS en la respuesta exitosa
    return new Response(
      JSON.stringify({ success: true, producto: updatedProd }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
