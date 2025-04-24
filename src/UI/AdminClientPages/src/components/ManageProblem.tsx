import ProblemList from "./ProblemList";
import "../styles/ManageProblem.css";


const ManageProblem = () => {
    return (
        <div className="PL-container" style={{ position: "relative" }}>
            <ProblemList />
        </div>
    );
};

export default ManageProblem;
