import React, { useEffect, useState } from "react";
import "../styles/GitHubHeatmap.css";
interface ActivityData {
    date: string;
    count: number;
}

interface GitHubHeatmapProps {
    activityData: ActivityData[];
    startDate?: string;
    endDate?: string;
    showMonthLabels?: boolean;
    showWeekdayLabels?: boolean;
}

const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({
    activityData,
    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        .toISOString()
        .split("T")[0],
    endDate = new Date().toISOString().split("T")[0],
    showMonthLabels = true,
    showWeekdayLabels = true,
}) => {
    const [calendarData, setCalendarData] = useState<{
        cells: { date: string; count: number; x: number; y: number }[];
        months: { name: string; x: number }[];
        maxCount: number;
    }>({ cells: [], months: [], maxCount: 0 });

    useEffect(() => {
        const processData = () => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek);

            const activityMap: Record<string, number> = {};
            activityData.forEach((item) => {
                activityMap[item.date] = item.count;
            });

            const maxCount = Math.max(
                ...activityData.map((item) => item.count),
                1 
            );

            
            const cells: {
                date: string;
                count: number;
                x: number;
                y: number;
            }[] = [];
            const months: { name: string; x: number }[] = [];
            let currentDate = new Date(start);
            let weekIndex = 0;
            let lastMonth = -1;

            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split("T")[0];
                const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

                // Track month changes for labels
                const month = currentDate.getMonth();
                if (month !== lastMonth) {
                    lastMonth = month;
                    const monthName = currentDate.toLocaleString("default", {
                        month: "short",
                    });
                    months.push({
                        name: monthName,
                        x: weekIndex,
                    });
                }

                cells.push({
                    date: dateStr,
                    count: activityMap[dateStr] || 0,
                    x: weekIndex,
                    y: dayOfWeek,
                });

                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);

                // If we've reached a new week (Sunday), increment week index
                if (currentDate.getDay() === 0) {
                    weekIndex++;
                }
            }

            return { cells, months, maxCount };
        };

        setCalendarData(processData());
    }, [activityData, startDate, endDate]);

    // Get color class based on count and max value
    const getColorClass = (count: number, maxCount: number) => {
        if (count === 0) return "color-empty";

        const intensity = count / maxCount;
        if (intensity < 0.15) return "color-scale-1";
        if (intensity < 0.4) return "color-scale-2";
        if (intensity < 0.7) return "color-scale-3";
        return "color-scale-4";
    };

    // Format date for tooltip
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="panel">
            <div>
                <h1>Activity</h1>
            </div>
            <div className="github-heatmap">
                <div className="calendar-container">
                    {showWeekdayLabels && (
                        <div className="weekday-labels">
                            <div className="weekday-label">Mon</div>
                            <div className="weekday-label">Wed</div>
                            <div className="weekday-label">Fri</div>
                        </div>
                    )}
                    <div
                        className="calendar-grid"
                        style={{
                            gridTemplateColumns: `repeat(${
                                calendarData.months.length * 4 + 1
                            }, 1fr)`,
                        }}
                    >
                        {showMonthLabels && (
                            <div className="month-labels">
                                {calendarData.months.map((month, i) => (
                                    <div
                                        key={`${month.name}-${i}`}
                                        className="month-label"
                                        style={{ gridColumn: month.x + 1 }}
                                    >
                                        {month.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="cells-container">
                            {calendarData.cells.map((cell, i) => (
                                <div
                                    key={`${cell.date}-${i}`}
                                    className={`calendar-cell ${getColorClass(
                                        cell.count,
                                        calendarData.maxCount
                                    )}`}
                                    style={{
                                        gridColumn: cell.x + 1,
                                        gridRow: cell.y + 1,
                                    }}
                                    title={`${
                                        cell.count
                                    } contributions on ${formatDate(
                                        cell.date
                                    )}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="calendar-footer">
                    <div className="legend">
                        <div className="legend-text">Less</div>
                        <div className="legend-cells">
                            <div className="legend-cell color-empty"></div>
                            <div className="legend-cell color-scale-1"></div>
                            <div className="legend-cell color-scale-2"></div>
                            <div className="legend-cell color-scale-3"></div>
                            <div className="legend-cell color-scale-4"></div>
                        </div>
                        <div className="legend-text">More</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitHubHeatmap;
