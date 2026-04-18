import { getPrayerTime } from "./prayerTime";

const template = document.getElementById("times-box");
const timeContainer = document.querySelector(".time-box-container");
const hijriDate = document.querySelector(".hijri-date");
const enDate = document.querySelector(".en-date");
const locationName = document.querySelector(".location-name");
const countdown = document.querySelector(".countdown");
const upcomingPrayerTxt = document.querySelector(".upcoming-prayer");

let currentPrayer;

const samplePrayerValues = {
  Asr: "13:46",
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

const sampleDate = {
  readable: "16 Apr 2026",
  hijri: { day: "28", month: { en: "Shawwal", days: 29 }, year: "1447" },
};

// async function getLocation() {
//   alert("hey, we're inside getLocation");

//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// }

function getLocation() {
  return new Promise((resolve) => {
    let done = false;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        done = true;
        resolve(pos);
      },
      (err) => {
        done = true;
        resolve(null);
      },
    );

    setTimeout(() => {
      if (!done) {
        resolve(null);
      }
    }, 5000);
  });
}

async function init() {
  let coords = { latitude: 51.509865, longitude: -0.118092 };
  try {
    const position = await getLocation();

    if (position?.coords) {
      coords = position.coords;
      // alert("howdy, the cords has been found");
    } else {
      // alert("yeesh, I got a bad news");
      // alert(`${coords.latitude}`);
    }

    const { latitude, longitude } = coords;

    if (!latitude || !longitude) return;
    // console.log(latitude, longitude);

    // const data = await fetch(`/api/prayer?lat=${latitude}&lon=${longitude}`);
    // const prayerData = await data.json();
    const prayerData = "Sample Value";

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
  // renders prayer time boxes to the UI and format the times to 12 hours format
  // prayerNames.forEach((name) => {
  //   const time = data.data.times[name];
  //   renderPrayerTime(name, formatTime(time));
  //   prayerTimes[name] = time;
  // });
  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const prayerTimes = {};

  prayerNames.forEach((name) => {
    const time = samplePrayerValues[name];
    prayerTimes[name] = time;
  });

  // handle the next prayer and ther remaining time untill the next prayer
  upcomingPrayerTimer(prayerTimes);

  // updates the current date and hijri date
  updateDate(sampleDate.hijri, sampleDate.readable);
  // updateDate(data.data.date.hijri, data.data.date.readable);

  // renders the current location nme
  renderLocationName(coords);
}

function renderPrayerTime(data) {
  // console.log("upcomingPrayer", currentPrayer);

  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  console.log(data);

  // TODO: sort the prayer boxes based on the rotatePrayer so the next prayer appears first
  setInterval(() => {
    const now = new Date();
    const formattedPrayerTimes = fixPrayerTimes(data, now);
    const nextPrayer = getNextPrayer(formattedPrayerTimes);

    // console.log(nextPrayer.name);

    const rotatedPrayers = rotatePrayer(formattedPrayerTimes, nextPrayer);

    const sortedPrayers = rotatedPrayers.map((prayer) => prayer.name);

    // console.log(sortedPrayers);

    timeContainer.innerHTML = "";

    sortedPrayers.forEach((name) => {
      const clone = template.content.cloneNode(true);

      const time = data[name];

      clone.querySelector(".prayer-name").textContent = name;
      clone.querySelector(".prayer-time").textContent = formatTime(time).time;
      clone.querySelector(".prayer-span").textContent = formatTime(time).period;

      timeContainer.appendChild(clone);
    });

    const nextPrayerEl = document.querySelectorAll(".time-box");

    nextPrayerEl[0].classList.add("selected");

    console.log(nextPrayerEl[0]);
  }, 1000);
}

function rotatePrayer(prayers, startValue) {
  const index = prayers.indexOf(startValue);

  if (index === -1) return prayers; // value not found, just return original

  return [...prayers.slice(index), ...prayers.slice(0, index)];
}

// function renderPrayerTime(name, time) {
//   const clone = template.content.cloneNode(true);

//   clone.querySelector(".prayer-name").textContent = name;
//   clone.querySelector(".prayer-time").textContent = time.time;
//   clone.querySelector(".prayer-span").textContent = time.period;

//   timeContainer.appendChild(clone);
// }

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
    let totalSeconds = Math.floor((targetTime - now) / 1000);

    // handles what happens when the counter reached 0
    if (totalSeconds <= 0) {
      countdown.textContent = "00:00:00";
      return;
    }

    // updates upcoming prayer Name and the remaining time
    updateUpcomingPrayer(totalSeconds, nextPrayer.name);
  }, 1000);
}

function getNextPrayer(formattedPrayerTimes) {
  let nextPrayer = formattedPrayerTimes.find(
    (prayer) => new Date() < prayer.time,
  );

  const aDay = formattedPrayerTimes[0].time.getTime() + 86_400_000;

  formattedPrayerTimes[0].time = new Date(aDay);

  if (!nextPrayer) nextPrayer = formattedPrayerTimes[0];

  return nextPrayer;
}

function updateUpcomingPrayer(totalSeconds, nextPrayerName) {
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
  upcomingPrayerTxt.textContent = nextPrayerName;

  // currentPrayer = nextPrayer;
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
