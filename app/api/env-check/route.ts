export const runtime = "nodejs";

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;

  return new Response(
    JSON.stringify({
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
      len: {
        url: url?.length ?? 0,
        anon: anon?.length ?? 0
      }
    }),
    { headers: { "content-type": "application/json" } }
  );
}
