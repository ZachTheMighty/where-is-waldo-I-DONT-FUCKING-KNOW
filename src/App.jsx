import { useState } from "react";
import Game from "./components/game.jsx";

export default function App() {
  const [key, setKey] = useState(0);
  return <Game key={key} playAgain={() => setKey((prevKey) => prevKey + 1)} />;
}
