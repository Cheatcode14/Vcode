import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

interface Submission {
  code: string;
  timestamp: string;
  ip: string;
  language: string;
}

const SubmissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
  const submission: Submission | undefined = submissions[parseInt(id || "-1")];

  if (!submission) {
    return <div className="text-white">Submission not found</div>;
  }

  return (
    <div className="p-4 bg-dark text-white min-vh-100">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>⬅ Back</button>
      <h2 className="mb-3">Submission Details</h2>
      <p><strong>Language:</strong> {submission.language}</p>
      <p><strong>IP:</strong> {submission.ip}</p>
      <p><strong>Timestamp:</strong> {submission.timestamp}</p>
      <pre className="bg-black p-3 rounded mt-3 text-white">
        {submission.code}
      </pre>
    </div>
  );
};

export default SubmissionDetails;
