// app/api/env-check/route.ts
export const runtime = "nodejs"; // Edge だと env が読めないことがあるため念のため

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return new Response(
    JSON.stringify({
      NEXT_PUBLIC_SUPABASE_URL: hasUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnon,
    }),
    { headers: { "content-type": "application/json" } }
  );
}
