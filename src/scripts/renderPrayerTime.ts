import { fixPrayerTimes } from "./fixPrayerTimes";
import { formatTime } from "./formatTime";
import { getNextPrayer } from "./getNextPrayer";
import { rotatePrayer } from "./rotatePrayer";

const timeContainer = document.querySelector(
  ".time-box-container",
) as HTMLElement | null;
const template = document.getElementById(
  "times-box",
) as HTMLTemplateElement | null;

export function renderPrayerTime(data: Record<string, string>) {
  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  console.log(data);

  // TODO: sort the prayer boxes based on the rotatePrayer so the next prayer appears first
  setInterval(() => {
    const now = new Date();
    const formattedPrayerTimes = fixPrayerTimes(data, now);
    const nextPrayer = getNextPrayer(formattedPrayerTimes);
    const rotatedPrayers = rotatePrayer(formattedPrayerTimes, nextPrayer);
    const sortedPrayers = rotatedPrayers.map((prayer) => prayer.name);

    timeContainer && (timeContainer.innerHTML = "");

    sortedPrayers.forEach((name) => {
      if (!template) return;
      const clone = template.content.cloneNode(true) as DocumentFragment;

      const time = data[name];

      const nameEl = clone.querySelector(".prayer-name") as HTMLElement | null;
      const timeEl = clone.querySelector(".prayer-time") as HTMLElement | null;
      const spanEl = clone.querySelector(".prayer-span") as HTMLElement | null;

      if (nameEl) nameEl.textContent = name;
      if (timeEl) timeEl.textContent = formatTime(time).time;
      if (spanEl) spanEl.textContent = formatTime(time).period;

      timeContainer && timeContainer.appendChild(clone);
    });

    const nextPrayerEl = document.querySelectorAll(".time-box");

    nextPrayerEl[0].classList.add("selected");

    console.log(nextPrayerEl[0]);
  }, 1000);
}
