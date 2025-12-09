// supabase/functions/api.js  ← ¡JavaScript puro!
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
)

serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname
  const method = req.method

  // ====================== AUTH ======================
  let userId = null
  const authHeader = req.headers.get("Authorization")

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (!error && user) {
      userId = user.id
    }
  }

  try {
    // ====================== RUTAS PROTEGIDAS ======================
    if (!userId && !path.includes("/sesion-activa")) {
      return new Response(JSON.stringify({ error: "Autenticación requerida" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 1. Crear sesión
    if (method === "POST" && path === "/functions/v1/api/sesiones") {
      const body = await req.json()
      const { data, error } = await supabase
        .from("sesiones")
        .insert({ ...body, user_id: userId })
        .select()
        .single()

      return new Response(JSON.stringify({ data, error: error?.message }), {
        status: error ? 400 : 201,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 2. Obtener todas las sesiones del usuario
    if (method === "GET" && path.startsWith("/functions/v1/api/sesiones/")) {
      const { data, error } = await supabase
        .from("sesiones")
        .select("*, tareas(*)")
        .eq("user_id", userId)
        .order("fecha_creacion", { ascending: false })

      return new Response(JSON.stringify({ data, error: error?.message }), {
        status: error ? 400 : 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 3. Obtener una sesión por ID
    if (method === "GET" && path.match(/\/functions\/v1\/api\/[a-zA-Z0-9-]+$/)) {
      const id = path.split("/").pop()
      const { data, error } = await supabase
        .from("sesiones")
        .select("*, tareas(*)")
        .eq("id", id)
        .eq("user_id", userId)
        .single()

      return new Response(JSON.stringify({ data, error: error?.message }), {
        status: error ? 404 : 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 4. Eliminar sesión
    if (method === "DELETE" && path.match(/\/functions\/v1\/api\/[a-zA-Z0-9-]+$/)) {
      const id = path.split("/").pop()
      const { error } = await supabase
        .from("sesiones")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)

      return new Response(JSON.stringify({ success: !error, error: error?.message }), {
        status: error ? 400 : 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 5. Gestionar tarea (start/pause/complete)
    if (method === "POST" && path.includes("/tareas/") && path.includes("/gestionar")) {
      const tareaId = path.split("/tareas/")[1].split("/")[0]
      const { accion } = await req.json()

      const updates = {}
      if (accion === "start") updates.inicio = new Date().toISOString()
      if (accion === "pause") updates.pausado = true
      if (accion === "complete") updates.completada = true

      const { data, error } = await supabase
        .from("tareas")
        .update(updates)
        .eq("id", tareaId)
        .select()
        .single()

      return new Response(JSON.stringify({ data, error: error?.message }), {
        status: error ? 400 : 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Ruta no encontrada
    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), { status: 404 })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})