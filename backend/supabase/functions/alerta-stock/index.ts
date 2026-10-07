Deno.serve(async (req) => {
  // Supabase envía el payload del Webhook en formato JSON
  const payload = await req.json();

  // 'record' contiene la fila después del UPDATE
  const record = payload.record;

  if (!record) return new Response("Ignorado", { status: 200 });

  if (record.stock < record.stock_minimo) {
    console.log(
      `ALERTA CRÍTICA: ${record.nombre} (ID: ${record.id}) cayó a ${record.stock} unidades.`,
    );
    // Aquí podrías agregar un fetch() para enviar un mensaje a Discord, Slack o Email.
  } else {
    console.log(
      `Stock estable para ${record.nombre}: ${record.stock} unidades.`,
    );
  }

  return new Response("Evento procesado correctamente", { status: 200 });
});
