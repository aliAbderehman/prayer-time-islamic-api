import { fixPrayerTimes } from "./fixPrayerTimes";
import { getNextPrayer } from "./getNextPrayer";
import { renderPrayerTime } from "./renderPrayerTime";
import { updateUpcomingPrayer } from "./updateUpcomingPrayer";

const countdown = document.querySelector(".countdown") as HTMLElement | null;

export function upcomingPrayerTimer(prayerTime: Record<string, string>) {
  renderPrayerTime(prayerTime);

  delete prayerTime.Sunrise;

  // TODO: handle what happens when the timer reached 0
  setInterval(() => {
    const now = new Date();

    // fixed the prayer names and times with keys  ex. {name: 'Fajr', time: '05:05'}
    const formattedPrayerTimes = fixPrayerTimes(prayerTime, now);

    const nextPrayer = getNextPrayer(formattedPrayerTimes);

    const targetTime = nextPrayer.time;

    // const timeBoxTxt = document.querySelector(".time-box-txt");
    // const now = new Date();
    let totalSeconds = Math.floor(
      (targetTime.getTime() - now.getTime()) / 1000,
    );

    // handles what happens when the counter reached 0
    if (totalSeconds <= 0) {
      countdown && (countdown.textContent = "00:00:00");
      return;
    }

    // updates upcoming prayer Name and the remaining time
    updateUpcomingPrayer(totalSeconds, nextPrayer.name);
  }, 1000);
}
