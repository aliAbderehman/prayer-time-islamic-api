const locationName = document.querySelector(
  ".location-name",
) as HTMLElement | null;

export async function renderLocationName(coords: {
  latitude: number;
  longitude: number;
}) {
  console.log(coords);
  const location = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
  );

  const data = await location.json();
  const address = data.address;

  const place =
    address.city ||
    address.town ||
    address.village ||
    address.state ||
    "Unknown location";

  const country = address.country || "";

  // console.log(data);
  locationName && (locationName.textContent = `${place}, ${country}`);
}
