const hijriDate = document.querySelector(".hijri-date") as HTMLElement | null;
const enDate = document.querySelector(".en-date") as HTMLElement | null;

type HijriInfo = {
  day: string;
  month: { en: string; days: number };
  year: string;
};

export function updateDate(hijri: HijriInfo, date: string) {
  const formattedhijri = `${hijri.day} ${hijri.month.en}, ${hijri.year}`;
  hijriDate && (hijriDate.textContent = formattedhijri);
  enDate && (enDate.textContent = date);
}
