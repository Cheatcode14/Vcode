import SubmissionList from "./SubmissionList";
import "../styles/ManageProblem.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
const ManageSubmissions = () => {
    return (
        <div className="overflow-hidden">
            <SubmissionList />
        </div>
    );
};

export default ManageSubmissions;
