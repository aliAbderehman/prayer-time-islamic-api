export async function GET({ url }) {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const method = url.searchParams.get("method") || 3;
  const school = url.searchParams.get("school") || 1;

  console.log(url);

  console.log("RAW URL:", url.toString());
  console.log("SEARCH:", url.search);

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat/lon" }), {
      status: 400,
    });
  }

  const apiKey = import.meta.env.API_KEY;

  const res = await fetch(
    `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lon}&date=2026-03&api_key=${apiKey}`,
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
