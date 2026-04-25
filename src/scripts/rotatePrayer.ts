export function rotatePrayer(
  prayers: { name: string; time: Date }[],
  startValue: { name: string; time: Date },
) {
  const index = prayers.indexOf(startValue);

  if (index === -1) return prayers; // value not found, just return original

  return [...prayers.slice(index), ...prayers.slice(0, index)];
}
