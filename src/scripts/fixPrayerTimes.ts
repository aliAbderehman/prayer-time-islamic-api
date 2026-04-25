// fixes the prayer names and times with keys  ex. {name: 'Fajr', time: '05:05'}
export function fixPrayerTimes(prayerTime: Record<string, string>, now: Date) {
  return Object.entries(prayerTime).map((prayer) => {
    // extract hours and minituse of selected prayer
    const [hours, minutes] = prayer[1].split(":");
    const todayAt = new Date(now);

    // sets the hours minutes and seconds for the prayer time
    todayAt.setHours(+hours);
    todayAt.setMinutes(+minutes);
    todayAt.setSeconds(0);

    return {
      name: prayer[0],
      time: todayAt,
    };
  });
}
