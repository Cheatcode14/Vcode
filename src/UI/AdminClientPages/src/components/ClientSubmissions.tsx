import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles/ProblemList.css";

interface Submission {
  code: string;
  timestamp: string;
  ip: string;
  language: string;
}

const ClientSubmissions: React.FC = () => {
  const { port,hostIP } = useUser();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://${hostIP}:${port}/submissions`);
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data: Submission[] = await response.json();
        setSubmissions(data);
        localStorage.setItem("submissions", JSON.stringify(data)); // Store locally for details page
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getCodeSnippet = (code: string): string => {
    const words = code.split(/\s+/);
    return words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");
  };

  const handleTileClick = (index: number) => {
    navigate(`/submission/${index}`);
  };

  return (
    <div className="overflow-auto">
      <h2 className="problemList-title">Your Submissions</h2>

      {loading && <p className="text-white">Loading submissions...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <ul className="list-group">
        {submissions.map((sub, index) => (
          <li key={index}>
            <div
              className="pli cursor-pointer"
              onClick={() => handleTileClick(index)}
            >
              <div className="problem-content">
                <strong>Language: {sub.language}</strong>
                <div className="difficulty">Time: {sub.timestamp}</div>
                <div className="tags">
                  <span className="tag">IP: {sub.ip}</span>
                </div>
              </div>
              <div className="text-white mt-2">
                <code className="bg-dark p-2 rounded d-block">
                  {getCodeSnippet(sub.code)}
                </code>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientSubmissions;
