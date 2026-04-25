export const getPrayerTime = async function (lat: number, lng: number) {
  console.log("hello from typescript");
  // Generate today's date in DD-MM-YYYY format
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}-${mm}-${yyyy}`;
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${lat}&longitude=${lng}&method=2`,
    );
    const data = await response.json();
    return data;
  } catch (e) {}
};
