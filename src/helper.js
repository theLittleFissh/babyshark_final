export function convertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":").map(Number);

  // Check if it's midnight (00:00) or noon (12:00)
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  // Format the time
  const formattedTime = `${hours12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return formattedTime;
}
