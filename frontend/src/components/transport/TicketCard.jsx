// src/components/transport/TicketCard.jsx

import { FaTicketAlt, FaExternalLinkAlt } from "react-icons/fa";

const tickets = [
  { zone: "AB", price: "3.20 €" },
  { zone: "ABC", price: "4.40 €" },
  { zone: "ABCD", price: "4.80 €" },
  { zone: "Day ticket", price: "10.00 €" },
];

export default function TicketCard({ isDarkMode }) {
  const panelBg = isDarkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900";
  const headerGradient = "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400";

  return (
    <div
      className={`relative rounded-2xl p-4 shadow-lg overflow-hidden ${panelBg} transform transition-transform duration-300 hover:scale-105`}
    >
      {/* Header with glow */}
      <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl shadow-md ${headerGradient} text-white`}>
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm shadow-lg animate-pulse">
          <FaTicketAlt size={40} />
        </div>
        <h3 className="font-bold text-lg">Ticket Info based on zones</h3>
      </div>

      {/* Ticket grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tickets.map((ticket) => {
          const color = {
            AB: "from-green-200 to-green-300 text-green-800",
            ABC: "from-blue-200 to-blue-300 text-blue-800",
            ABCD: "from-purple-200 to-purple-300 text-purple-800",
            "Day ticket": "from-yellow-200 to-yellow-300 text-yellow-800",
          }[ticket.zone];

          return (
            <div
              key={ticket.zone}
              className={`relative rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-md overflow-hidden`}
            >
              {/* Animated glow */}
              <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${color} opacity-30 blur-xl animate-pulse`} />
              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <span className="text-sm font-semibold">{ticket.zone}</span>
                <span className="text-lg font-bold">{ticket.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* More info link */}
      <a
        href="https://www.hsl.fi/en/tickets"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-blue-500 hover:underline"
      >
        More info <FaExternalLinkAlt className="text-xs" />
      </a>
    </div>
  );
}
