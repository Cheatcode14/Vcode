import { useEffect, useState } from "react";

function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", { hour12: false });
    };

    return (
        <div className="digital-clock">
            <div className="clock-time">{formatTime(time)}</div>
        </div>
    );
}

export default DigitalClock;
