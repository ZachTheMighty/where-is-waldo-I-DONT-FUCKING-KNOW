import photo from "../assets/photo.jpg";
import { useEffect, useRef, useState } from "react";
import secondToMS from "../utils/seconds_to_ms.js";
import { Check } from "lucide-react";
import { TableHead, TableData } from "./table.jsx";

const imageModules = import.meta.glob("../assets/char*", { eager: true });
const imageUrls = Object.values(imageModules).map((mod) => mod.default);

export default function Game({ playAgain }) {
  const [time, setTime] = useState(0);
  const [currentFound, setCurrentFound] = useState(false);
  const [win, setWin] = useState(false);
  const [characters, setCharacters] = useState(
    imageUrls.map((url, index) => {
      return { id: index + 1, url, found: false };
    }),
  );
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState(null);

  const [top, setTop] = useState([]);

  const photoRef = useRef(null);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    if (characters.every((char) => char.found)) return setWin(true);

    const interval = setInterval(
      () =>
        setTime(((performance.now() - startTimeRef.current) / 1000).toFixed(3)),
      10,
    );
    return () => clearInterval(interval);
  }, [characters]);

  useEffect(() => {
    fetch("http://localhost:8080/users/top")
      .then((response) => response.json())
      .then((data) => setTop(data));
  }, []);

  const handleClick = async (event) => {
    if (!photoRef.current) return;

    const rect = photoRef.current.getBoundingClientRect();

    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    const percentX = (pixelX / rect.width) * 100;
    const percentY = (pixelY / rect.height) * 100;

    await fetch("http://localhost:8080/coords", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: percentX, y: percentY }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.found) setCurrentFound(true);
        else setCurrentFound(false);
        setCharacters(
          characters.map((char) =>
            char.id === data.character.id ? { ...char, found: true } : char,
          ),
        );
      });
  };

  const handleWin = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/users", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, time: parseFloat(time) }),
    });

    const data = await response.json();
    if (!response.ok) return setErrors(data.errors);
    setErrors(false);

    if (top.length < 3) return setTop([...top, data.user]);

    const userToReplace = top.findIndex((char) => data.user.time < char.time);
    if (userToReplace === -1) return;

    setTop(top.toSpliced(userToReplace, 0, data.user));
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
          {characters.map((char) => (
            <li key={char.url} className="flex flex-col items-center">
              <img src={char.url} className="h-25 sm:h-50" />
              {char.found && <Check className="text-green-500" size="30" />}
            </li>
          ))}
        </ul>
      </div>
      <img onClick={(event) => handleClick(event)} src={photo} ref={photoRef} />
      {win && errors !== false ? (
        <div className="flex flex-col gap-4">
          <div>Congratulations! You have found waldo in {secondToMS(time)}</div>
          <form
            onSubmit={(event) => handleWin(event)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                className="outline p-4 hover:outline-blue-500 focus:outline-2 focus:outline-blue-500"
                placeholder="Enter name"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              {errors && (
                <ul className="list-disc text-xs text-red-500 mt-2 font-bold">
                  {errors.map((error, index) => {
                    return (
                      <li key={index} className="">
                        {error.msg}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 active:bg-gray-200 font-bold">
              Submit record
            </button>
          </form>
        </div>
      ) : win && errors === false ? (
        <div className="flex flex-col justify-center items-center gap-8">
          <div>Successfully recorded your time</div>
          <button
            onClick={playAgain}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 active:bg-gray-200 font-bold w-full"
          >
            Play again
          </button>
        </div>
      ) : (
        ""
      )}
      <div>{currentFound ? "You have found a character." : "Missed"}</div>

      <table className="mb-80">
        <caption className="bg-yellow-500 py-2">LEADERBOARD</caption>
        <thead>
          <tr className="bg-cyan-500">
            <TableHead text="Rank" />
            <TableHead text="Name" />
            <TableHead text="Time" />
          </tr>
        </thead>
        <tbody>
          {top
            .slice(0, 3)
            .toSorted((charA, charB) => charA.time - charB.time)
            .map((user, index) => (
              <tr key={user.id} className="bg-gray-500">
                <TableData text={index + 1} />
                <TableData text={user.name} />
                <TableData text={secondToMS(user.time)} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
