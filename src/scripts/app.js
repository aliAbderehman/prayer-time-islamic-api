import { getPrayerTime } from "./prayerTime";

const template = document.getElementById("time-box");
const timeContainer = document.querySelector(".time-box-container");
const hijriDate = document.querySelector(".hijri-date");
const enDate = document.querySelector(".en-date");
const locationName = document.querySelector(".location-name");
const countdown = document.querySelector(".countdown");
const upcomingPrayerTxt = document.querySelector(".upcoming-prayer");

const samplePrayerValues = {
  Asr: "15:30",
  Dhuhr: "12:25",
  Fajr: "05:04",
  Firstthird: "22:28",
  Imsak: "04:54",
  Isha: "19:46",
  Lastthird: "02:22",
  Maghrib: "18:35",
  Midnight: "00:25",
  Sunrise: "06:15",
  Sunset: "18:35",
};

// const sampleDate = {
//   readable: "16 Apr 2026",
//   hijri: { day: "28", month: { en: "Shawwal", days: 29 } },
//   year: "1227",
// };

async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function init() {
  try {
    const position = await getLocation();

    const { latitude, longitude } = position.coords;

    if (!latitude || !longitude) return;
    // console.log(latitude, longitude);

    const data = await fetch(`/api/prayer?lat=${latitude}&lon=${longitude}`);
    const prayerData = await data.json();
    // const prayerData = "Sample Value";

    console.log(prayerData);

    // const monthData = await fetch(
    //   `/api/monthPrayerTimes?lat=${latitude}&lon=${longitude}`,
    // );

    // const monthPrayer = await monthData.json();
    // console.log(monthPrayer);

    updateUI(prayerData, { latitude, longitude });
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

function updateUI(data, coords) {
  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const prayerTimes = {};

  // renders prayer time boxes to the UI and format the times to 12 hours format
  prayerNames.forEach((name) => {
    const time = data.data.times[name];
    renderPrayerTime(name, formatTime(time));
    prayerTimes[name] = time;
  });

  // prayerNames.forEach((name) => {
  //   const time = samplePrayerValues[name];
  //   renderPrayerTime(name, formatTime(time));
  //   prayerTimes[name] = time;
  // });

  // remove sunrise out of prayerTimes object
  delete prayerTimes.Sunrise;

  // handle the next prayer and ther remaining time untill the next prayer
  upcomingPrayerTimer(prayerTimes);

  // updates the current date and hijri date
  updateDate(data.data.date.hijri, data.data.date.readable);

  // renders the current location nme
  renderLocationName(coords);
}

function renderPrayerTime(name, time) {
  const clone = template.content.cloneNode(true);

  clone.querySelector(".prayer-name").textContent = name;
  clone.querySelector(".prayer-time").textContent = time.time;
  clone.querySelector(".prayer-span").textContent = time.period;

  timeContainer.appendChild(clone);
}

// TODO: handle count down upcoming prayer

// fixes the prayer names and times with keys  ex. {name: 'Fajr', time: '05:05'}
function fixPrayerTimes(prayerTime, now) {
  return Object.entries(prayerTime).map((prayer) => {
    // extract hours and minituse of selected prayer
    const [hours, minutes] = prayer[1].split(":");
    const todayAt = new Date(now);

    // sets the hours minutes and seconds for the prayer time
    todayAt.setHours(hours);
    todayAt.setMinutes(minutes);
    todayAt.setSeconds(0);

    return {
      name: prayer[0],
      time: todayAt,
    };
  });
}

function handleCoutdown() {}

function upcomingPrayerTimer(prayerTime) {
  const now = new Date();

  // fixed the prayer names and times with keys  ex. {name: 'Fajr', time: '05:05'}
  const formattedPrayerTimes = fixPrayerTimes(prayerTime, now);

  let nextPrayer = formattedPrayerTimes.find(
    (prayer) => new Date() < prayer.time,
  );

  const aDay = formattedPrayerTimes[0].time.getTime() + 86_400_000;

  formattedPrayerTimes[0].time = new Date(aDay);

  console.log(formattedPrayerTimes[0].time);

  if (!nextPrayer) nextPrayer = formattedPrayerTimes[0];
  // TODO: hadle undefined

  console.log("check: ", nextPrayer);

  const targetTime = nextPrayer.time;

  const timeBoxTxt = document.querySelector(".time-box-txt");

  // TODO: handle what happens when the timer reached 0
  setInterval(() => {
    const now = new Date();
    let totalSeconds = Math.floor((targetTime - now) / 1000);

    if (totalSeconds <= 0) {
      countdown.textContent = "00:00:00";
      return;
    }

    const difHour = Math.floor(totalSeconds / 3600);
    const difMin = Math.floor((totalSeconds % 3600) / 60);
    const difSec = totalSeconds % 60;

    const formattedTime =
      String(difHour).padStart(2, "0") +
      ":" +
      String(difMin).padStart(2, "0") +
      ":" +
      String(difSec).padStart(2, "0");

    countdown.textContent = formattedTime;
  }, 1000);

  upcomingPrayerTxt.textContent = nextPrayer.name;
}

function updateDate(hijri, date) {
  const formattedhijri = `${hijri.day} ${hijri.month.en}, ${hijri.year}`;
  hijriDate.textContent = formattedhijri;
  enDate.textContent = date;
}

async function renderLocationName(coords) {
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
  locationName.textContent = `${place}, ${country}`;
}

init();

// const now = new Date();
// const year = now.getFullYear();
// const month = now.getMonth() + 1;
// const date = now.getDate();
// const hoursNow = now.getHours();
// const minutesNow = now.getMinutes();

// console.log("DATE:", new Date(Date.now()).getMonth());

// const nextPrayer = Object.entries(prayerTime).map((time) => {
//   return time;
// });

// console.log(nextPrayer);

// const todayPrayers = nextPrayer.map((prayer) => ({
//   name: [prayer[0]],
//   time: new Date(`${year}, ${month}, ${date}, ${prayer[1]}`),
// }));

// console.log(todayPrayers);

// const upcomingPrayer = todayPrayers.find(
//   (prayer) => new Date(Object.values(prayer)) > new Date(),
// );

// console.log(upcomingPrayer);
// upcomingPrayerTxt.textContent = upcomingPrayer.name;

// let countdownTime = upcomingPrayer.time - new Date();

// console.log(new Date(countdownTime));

// // setInterval(() => {
// //   upcomingPrayer -= 1000;
// //   console.log(new Date(upcomingPrayer));
// // }, 1000);

// // console.log(upcomingPrayer);

// 0
// :
// {name: 'Fajr', time: Wed Apr 15 2026 05:05:00 GMT+0300 (East Africa Time)}
// 1
// :
// {name: 'Dhuhr', time: Wed Apr 15 2026 12:25:00 GMT+0300 (East Africa Time)}
// 2
// :
// {name: 'Asr', time: Wed Apr 15 2026 15:30:00 GMT+0300 (East Africa Time)}
// 3
// :
// {name: 'Maghrib', time: Wed Apr 15 2026 18:35:00 GMT+0300 (East Africa Time)}
// 4
// :
// {name: 'Isha', time: Wed Apr 15 2026 19:42:00 GMT+0300 (East Africa Time)}
