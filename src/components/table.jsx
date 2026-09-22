import { Crown } from "lucide-react";

export function TableHead({ text }) {
  return (
    <th className="p-4 sm:p-8 border border-white/10 sm:text-xl">{text}</th>
  );
}

export function TableData({ text }) {
  return (
    <td className="p-4 sm:p-8 border border-white/10 font-bold text-white  sm:text-xl text-center">
      {text === 1 ? (
        <div className="flex items-center justify-end gap-1">
          {text}
          <Crown className="text-yellow-500" />
        </div>
      ) : (
        text
      )}
    </td>
  );
}
