const countdown = document.querySelector(".countdown") as HTMLElement | null;
const upcomingPrayerTxt = document.querySelector(
  ".upcoming-prayer",
) as HTMLElement | null;

export function updateUpcomingPrayer(
  totalSeconds: number,
  nextPrayerName: string,
) {
  const difHour = Math.floor(totalSeconds / 3600);
  const difMin = Math.floor((totalSeconds % 3600) / 60);
  const difSec = totalSeconds % 60;

  const formattedTime =
    String(difHour).padStart(2, "0") +
    ":" +
    String(difMin).padStart(2, "0") +
    ":" +
    String(difSec).padStart(2, "0");

  countdown && (countdown.textContent = formattedTime);
  upcomingPrayerTxt && (upcomingPrayerTxt.textContent = nextPrayerName);

  // currentPrayer = nextPrayer;
}
