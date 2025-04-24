import "../styles/Dashboard.css";
import SubmissionList from "../components/SubmissionList";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import CalendarWidget from "../components/CalendarWidget";
import DigitalClock from "../components/DigitalClock";
import TopUsersTable from "../components/TopUsersTable";


function Dashboard() {

  const topUsers = [
    { username: 'devDude42', submissions: 89 },
    { username: 'codeQueen', submissions: 75 },
    { username: 'algoSam', submissions: 66 },
    { username: 'debugDan', submissions: 61 },
    { username: 'uiNinja', submissions: 55 },
  ];

  return (
      <div className="dashboard-container">
      <div className="dashboard-left">
          <h1 style={{ padding: "2rem", fontSize: "3.8em" }}>
              Dashboard
          </h1>
          <div className="dashboard-cards">
              <div className="dashboard-card  ">Total Users: 120</div>
              <div className="dashboard-card">Problems Created: 30</div>
              <div className="dashboard-card">Submissions Today: 150</div>
          </div>
          <div style={{height:"1rem"}}></div>
          <div className="dashboard-card">
            <TopUsersTable users={topUsers}/>
          </div>
          <div style={{height:"1rem"}}></div>
          <div className="dashboard-card">
            <SubmissionList></SubmissionList>
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

export default Dashboard;
