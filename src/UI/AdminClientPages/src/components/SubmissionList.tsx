import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles/SubmissionList.css";

const SubmissionList = () => {
    return (
        <>
            <div className="overflow-hidden">
                <h2 className="submissionList-title">Recent Submissions</h2>
                <ul className="list-group">
                    <li className="submission-item">
                        <span className="submission-problem">Problem 1</span>
                        <span className="submission-user">JohnDoe</span>
                    </li>
                    <li className="submission-item">
                        <span className="submission-problem">
                            Sorting Algorithm
                        </span>
                        <span className="submission-user">Alice123</span>
                    </li>
                    <li className="submission-item">
                        <span className="submission-problem">
                            Graph Traversal
                        </span>
                        <span className="submission-user">CoderX</span>
                    </li>
                    <li className="submission-item">
                        <span className="submission-problem">
                            Dynamic Programming
                        </span>
                        <span className="submission-user">Dev99</span>
                    </li>
                    <li className="submission-item">
                        <span className="submission-problem">
                            Binary Search
                        </span>
                        <span className="submission-user">TechGeek</span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SubmissionList;
