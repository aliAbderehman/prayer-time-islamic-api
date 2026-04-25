export function getNextPrayer(
  formattedPrayerTimes: { name: string; time: Date }[],
) {
  let nextPrayer = formattedPrayerTimes.find(
    (prayer) => new Date() < prayer.time,
  );

  const aDay = formattedPrayerTimes[0].time.getTime() + 86_400_000;

  formattedPrayerTimes[0].time = new Date(aDay);

  if (!nextPrayer) nextPrayer = formattedPrayerTimes[0];

  return nextPrayer;
}
