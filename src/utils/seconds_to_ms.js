export default function secondToMS(total) {
  const minutes = Math.trunc((total % 3600) / 60);
  const seconds = total % 60;
  return `${minutes > 0 ? minutes + "m" : ""}${seconds > 0 ? seconds + "s" : ""}`;
}
