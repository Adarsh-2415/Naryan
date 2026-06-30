export const SLOT_DURATION_MINUTES = 10;
export const CLINIC_START_TIME = "09:00 AM";
export const CLINIC_END_TIME = "06:00 PM";
export const DEFAULT_LUNCH_START = "12:30 PM";
export const DEFAULT_LUNCH_END = "02:00 PM";

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(" ");
  if (!time || !modifier) return 0;
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${modifier}`;
}

export function generateBaseSlots(): string[] {
  const startMin = timeToMinutes(CLINIC_START_TIME);
  const endMin = timeToMinutes(CLINIC_END_TIME);
  const slots: string[] = [];

  for (let time = startMin; time < endMin; time += SLOT_DURATION_MINUTES) {
    slots.push(minutesToTime(time));
  }
  return slots;
}

export const BASE_SLOTS = generateBaseSlots();

export function getDefaultLunchSlots(): string[] {
  const startMin = timeToMinutes(DEFAULT_LUNCH_START);
  const endMin = timeToMinutes(DEFAULT_LUNCH_END);
  return BASE_SLOTS.filter(slot => {
    const slotMin = timeToMinutes(slot);
    return slotMin >= startMin && slotMin < endMin;
  });
}
