export default function secondToMS(total) {
  const minutes = Math.trunc((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (total % 60).toFixed(3).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
