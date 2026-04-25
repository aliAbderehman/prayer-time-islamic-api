import { upcomingPrayerTimer } from "./upcomingPrayerTimer";
import { updateDate } from "./updateDate";
import { renderLocationName } from "./renderLocationName";

type SamplePrayerData = {
  Asr: string;
  Dhuhr: string;
  Fajr: string;
  Firstthird: string;
  Imsak: string;
  Isha: string;
  Lastthird: string;
  Maghrib: string;
  Midnight: string;
  Sunrise: string;
  Sunset: string;
};

const samplePrayerValues: SamplePrayerData = {
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

type HijriInfo = {
  day: string;
  month: { en: string; days: number };
  year: string;
};

type DateInfo = {
  readable: string;
  hijri: HijriInfo;
};

const sampleDate: DateInfo = {
  readable: "16 Apr 2026",
  hijri: { day: "28", month: { en: "Shawwal", days: 29 }, year: "1447" },
};

function getLocation(): Promise<GeolocationPosition | null> {
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
  let coords = { latitude: 9.123903, longitude: 38.72245 };
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

function updateUI(
  data: string,
  coords: { latitude: number; longitude: number },
) {
  // renders prayer time boxes to the UI and format the times to 12 hours format
  // prayerNames.forEach((name) => {
  //   const time = data.data.times[name];
  //   renderPrayerTime(name, formatTime(time));
  //   prayerTimes[name] = time;
  // });
  const prayerNames = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ] as const;

  //   const prayerTimes = {};

  // const obj: Record<string, string> = {};

  //   const prayerTimes: Record<string, string> = {};

  type PrayerName = (typeof prayerNames)[number];

  const prayerTimes: Partial<Record<PrayerName, string>> = {};

  prayerNames.forEach((name) => {
    const time: string = samplePrayerValues[name];
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

init();
