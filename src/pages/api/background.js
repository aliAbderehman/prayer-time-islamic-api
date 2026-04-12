export const getPrayerTime = async function () {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/2026-04-12?latitude=${lat}&longitude=${lng}&method=2`,
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {}
};
