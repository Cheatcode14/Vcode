import "../styles/ClientDashBoard.css";
import ClientProblemList from "../components/ClientProblemList";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import GitHubHeatmap from "../components/GitHubHeatmap.tsx";
import DigitalClock from "../components/DigitalClock.tsx";
import CalendarWidget from "../components/CalendarWidget.tsx";

function ClientDashboard() {
    const generateDummyData = () => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const data = [];
        const current = new Date(oneYearAgo);

        while (current <= today) {
            const dateStr = current.toISOString().split("T")[0];
            const count = Math.floor(Math.random() * 10);
            data.push({ date: dateStr, count });
            current.setDate(current.getDate() + 1);
        }

        return data;
    };

    const dummyActivityData = generateDummyData();

    return (
        <div className="dashboard-container">
            <div className="dashboard-left">
                <h1 style={{ padding: "2rem", fontSize: "3.8em" }}>
                    Dashboard
                </h1>
                <div className="dashboard-cards">
                    <div className="dashboard-card">Problems Solved: 30</div>
                    <div className="dashboard-card">Pending Problems: 4</div>
                </div>
                <div>
                    <GitHubHeatmap activityData={dummyActivityData} />
                </div>
                <div className="dashboard-card">
                    <ClientProblemList />
                </div>
            </div>
            <div className="dashboard-right">
                <div style={{ height: "8.8rem" }}></div>
                <DigitalClock />
                <CalendarWidget />
            </div>
        </div>
    );
}

export default ClientDashboard;
