const MIN_BAR_HEIGHT_PERCENT = 4;

export function getBarHeight(hours: number, maxHours: number) {
  const percent = (hours / maxHours) * 100;
  return `${percent > MIN_BAR_HEIGHT_PERCENT ? percent : MIN_BAR_HEIGHT_PERCENT}%`;
}
