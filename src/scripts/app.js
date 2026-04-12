import { getPrayerTime } from "../scripts/prayerTime";

const template = document.getElementById("time-box");
const timeContainer = document.querySelector(".time-box-container");

async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function init() {
  try {
    const position = await getLocation();

    const { latitude, longitude } = await position.coords;

    const prayerData = await getPrayerTime(latitude, longitude);
    console.log(prayerData);
    updateUI(prayerData);
  } catch (e) {
    console.error(e);
  }
}

function formatTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr);

  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return {
    time: `${hour}:${minute}`,
    period,
  };
}

function updateUI(data) {
  const name = Object.keys(data.data.timings).slice(0, 7);

  console.log(name);
  const time = Object.values(data.data.timings);
  //   cont time

  name.forEach((na, i, _) => {
    // console.log(i);
    renderPrayerTime(na, formatTime(time[i]));
  });
}

function renderPrayerTime(name, time, period = "AM") {
  const clone = template.content.cloneNode(true);

  clone.querySelector(".prayer-name").textContent = name;
  clone.querySelector(".prayer-time").textContent = time.time;
  //   console.log(template.content);
  clone.querySelector(".prayer-span").textContent = time.period;

  timeContainer.appendChild(clone);
}

init();
// console.log(getLocation());
