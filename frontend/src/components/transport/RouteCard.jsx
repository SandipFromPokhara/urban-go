import { ChevronRight } from "lucide-react";

export default function RouteCard({ route, onSelect }) {

    // --- FIXED TIME FORMATTING ---
    const start = new Date(route.modes[0].startTime);
    const end = new Date(route.modes[route.modes.length - 1].endTime);

    const startTime = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg transition"
            onClick={onSelect}
        >
            {/* Top Row */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-lg font-bold">{route.duration} min</span>
                    <span className="text-sm text-gray-500">{startTime} → {endTime}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        0g CO2
                    </div>
                    <ChevronRight className="text-gray-400" />
                </div>
            </div>

            {/* Mode Timeline */}
            <div className="flex w-full gap-2">
                {route.modes.map((mode, i) => (
                    <div
                        key={i}
                        style={{ flexGrow: Math.max(1, mode.duration) }}
                        className="flex items-center justify-center text-xs font-medium text-white rounded-md py-2"
                        data-mode={mode.m}
                    >
                        {getModeIcon(mode.m)} {mode.routeName || ""}
                    </div>
                ))}
            </div>

            {/* Info Row */}
            <div className="flex justify-between text-xs text-gray-600">
                <span>🚶 {getTotalWalking(route.modes)} min walk</span>
                {getZones(route.modes) && (
                    <span>Zones: {getZones(route.modes)}</span>
                )}
            </div>
        </div>
    );
}

function getModeIcon(m) {
    if (m === "walk") return "🚶";
    if (m === "metro") return "🚇";
    if (m === "train") return "🚆";
    if (m === "bus") return "🚌";
    return "•";
}

function getTotalWalking(modes) {
    const walking = modes
        .filter(m => m.m === "walk")
        .reduce((a, b) => a + b.duration, 0);

    return walking;
}

function getZones() {
    return "AB"; // placeholder
}
