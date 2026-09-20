import photo from "./assets/photo.jpg";
import { useEffect, useRef, useState } from "react";
import secondToMS from "./utils/seconds_to_ms.js";

export default function App() {
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const photoRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);

  const imageModules = import.meta.glob("./assets/char*", { eager: true });
  const imageUrls = Object.values(imageModules).map((mod) => mod.default);

  useEffect(() => {
    if (win) return;
    const interval = setInterval(
      () => setTime((prevTime) => prevTime + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [win]);

  const handleClick = (event) => {
    if (!photoRef.current) return;

    const rect = photoRef.current.getBoundingClientRect();

    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    const percentX = (pixelX / rect.width) * 100;
    const percentY = (pixelY / rect.height) * 100;

    setCoordinates({ x: percentX.toFixed(), y: percentY.toFixed() });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8">
      <div className="font-bold sm:text-3xl lg:text-5xl ">
        {secondToMS(time)}
      </div>
      <div className="w-full lg:w-6xl">
        <div className="text-xl font-bold sm:text-3xl mb-4">
          Find these shitheads
        </div>
        <ul className=" flex justify-between items-center flex-row">
          {imageUrls.map((char) => (
            <li key={char}>
              <img
                src={char}
                className={`${char.includes("3") ? "w-25 sm:w-50" : "w-12 sm:w-25"} `}
              />
            </li>
          ))}
        </ul>
      </div>
      <img
        onClick={(event) => handleClick(event)}
        src={photo}
        className="w-6xl"
        ref={photoRef}
      />
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
      <div>
        x: {coordinates?.x}, y: {coordinates?.y}
      </div>
    </div>
  );
}
