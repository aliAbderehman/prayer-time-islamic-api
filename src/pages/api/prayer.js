export async function GET({ url }) {
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const method = url.searchParams.get("method") || 3;
  const school = url.searchParams.get("school") || 0;

  const apiKey = import.meta.env.API_KEY;

  const res = await fetch(
    `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lng}&method=${method}&school=${school}&api_key=${apiKey}`,
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
