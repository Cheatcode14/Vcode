import { Link, useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles/ProblemList.css";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

const ProblemList = () => {
    
    const { port, hostIP} = useUser();
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

  const handleEditClick = (problemId: string) => {
    navigate(`/editProblem/${problemId}`);
  };

    const handleAddProblemClick = () => {
        navigate("/add-problem");
    };
    const fetchProblems = async () => {
        try {
            const response = await fetch(`http://${hostIP}:${port}/question`);
            if (response.ok) {
                const data = await response.json();
                setProblems(data);
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        }
    };

    const handleDeleteClick = async (problemId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this problem?"
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://${hostIP}:${port}/clearSingleSubmission/${problemId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                alert("🗑️ Problem deleted successfully!");
                fetchProblems(); // Refresh the list
            } else {
                const errText = await response.text();
                console.error("Server Error:", errText);
                alert("❌ Failed to delete the problem.");
            }
        } catch (error) {
            console.error("⚠️ Delete failed:", error);
            alert("⚠️ Could not connect to the server.");
        }
    };

  useEffect(() => {
    fetch(`http://${hostIP}:${port}/question`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        return response.json();
      })
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setLoading(false);
      });
  }, []);

    return (
        <div className="overflow-auto">
            <h2 className="problemList-title">Problem List</h2>
            <div className="input-group mb-3">
                <span className="input-group-text bg-dark text-white">🔍</span>
                <input
                    type="text"
                    className="form-control bg-dark text-white"
                    placeholder="Search problem..."
                />
            </div>
            <div className="mb-4">
                <button
                    className="btn btn-success"
                    onClick={handleAddProblemClick}
                >
                    ➕ Add New Problem
                </button>
            </div>
            {loading ? (
                <p>Loading problems...</p>
            ) : (
                <ul className="list-group">
                    {problems.map((problem) => (
                        <li key={problem.id}>
                            <Link
                                to={"/editProblem/" + problem.id}
                                className="pli"
                            >
                                <div className="problem-content">
                                    <strong>{problem.title}</strong>
                                    <div className="difficulty">
                                        Difficulty: {problem.difficulty}
                                    </div>
                                    <div className="tags">
                                        {problem.tags.map((tag, index) => (
                                            <span key={index} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className="settings-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEditClick(problem.id);
                                    }}
                                >
                                    ⚙️
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteClick(problem.id);
                                    }}
                                >
                                    🗑️
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProblemList;
