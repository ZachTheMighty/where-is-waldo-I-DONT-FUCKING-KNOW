import photo from "./assets/photo.jpg";
import { useEffect, useState } from "react";
import secondToMS from "./utils/seconds_to_ms.js";

export default function App() {
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (win) return;
    const interval = setInterval(
      () => setTime((prevTime) => prevTime + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [win]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8">
      <div className="font-bold sm:text-3xl lg:text-5xl ">{time}</div>
      <img src={photo} className="w-6xl" onClick={() => setWin(true)} />
      {win && (
        <div className="flex flex-col gap-4">
          <div>Congratulations! You have found waldo in {secondToMS(time)}</div>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                className="outline p-4 hover:outline-blue-500 focus:outline-2 focus:outline-blue-500"
              />
            </div>
            <button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 active:bg-gray-200 font-bold">
              Submit record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
