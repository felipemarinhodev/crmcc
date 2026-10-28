import { createClient } from "@supabase/supabase-js";

// Conexão com o banco no Supabase.
// Usa a chave secreta, por isso só pode ser usada em código que roda no servidor.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
