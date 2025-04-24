import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Correct Value type from react-calendar docs
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function CalendarWidget() {
    const [value, setValue] = useState<Value>(new Date());

    const handleChange = (
        value: Value,
        _event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setValue(value);
    };

    return (
        <div className="calendar-widget">
            <Calendar onChange={handleChange} value={value} />
        </div>
    );
}

export default CalendarWidget;
