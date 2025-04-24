import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles/ProblemList.css";
import { useUser } from "../context/UserContext";

const ClientProblemList = () => {
    const { port, hostIP } = useUser();
    const [problems, setProblems] = useState([
        { id: 1, title: "Two Sum", diff: "Easy", tags: ["Array", "HashMap"] },
        {
            id: 2,
            title: "Binary Tree Inorder Traversal",
            diff: "Medium",
            tags: ["Tree", "DFS"],
        },
        {
            id: 3,
            title: "Dijkstra's Algorithm",
            diff: "Hard",
            tags: ["Graph", "Shortest Path"],
        },
    ]);

    // Fetch problems from the backend
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch(
                    `http://${hostIP}:${port}/question`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseBody = await response.text();
                const data = JSON.parse(responseBody);
                console.log(data);
                setProblems(data);
            } catch (error) {
                console.error("❌ Error fetching problems:", error);
            }
        };

        fetchProblems();
    }, []);

    return (
        <div className="overflow-auto">
            <h2 className="problemList-title">Problem List</h2>
            <ul className="list-group">
                {problems.map((problem) => (
                    <li key={problem.id}>
                        <Link to={`/problempage/${problem.id}`} className="pli">
                            <strong>{problem.title}</strong> Difficulty:{" "}
                            {problem.diff}
                            <br />
                            {problem.tags?.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientProblemList;
