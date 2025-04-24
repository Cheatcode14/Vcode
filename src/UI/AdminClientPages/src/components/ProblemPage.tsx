import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "../styles/ProblemPage.css";
import { useUser } from "../context/UserContext";

const ProblemPage: React.FC = () => {
    const { port, hostIP, userName } = useUser();
    const { id } = useParams<{ id: string }>(); // Get the problem ID from the URL
    const [problem, setProblem] = useState<any>(null);
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState("// Write your code here...");
    const [output, setOutput] = useState("No output yet...");
    const [customTest, setCustomTest] = useState("");

    const startTime = useRef<number>(Date.now());  // Track start time directly here
    console.log(startTime);
    // Fetch problem details from the backend
    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const response = await fetch(
                    `http://${hostIP}:${port}/question/${id}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched problem:", data);

                // Only setting required fields
                setProblem({
                    title: data.title || "No title available",
                    difficulty: data.diff || "Unknown",
                    description: data.desc || "No description available",
                });
            } catch (error) {
                console.error("Error fetching problem details:", error);
            }
        };

        if (id) fetchProblemDetails();
    }, [id]);

    const handleSubmitCode = async () => {
        const endTime = Date.now(); // Record time when submitting
        console.log(endTime);
        const timeTaken = ((endTime - startTime.current)/ 1000).toFixed(0); // Calculate time difference in seconds

        setOutput("Submitting code...");
        
        const requestBody = {
            userId: userName,
            problemId: id,
            code,
            language,
            timeTaken,  // Submit the dynamically calculated timeTaken
        };

        try {
            const response = await fetch(`http://${hostIP}:${port}/submitCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setOutput(data.result || "No result received from server.");
        } catch (error) {
            console.error("Error submitting code:", error);
            setOutput("Error submitting code.");
        }
    };

    const handleRunCode = async () => {
        setOutput("Running code...");

        const requestBody = {
            language,
            code,
            testInput: customTest || null,
        };

        try {
            const response = await fetch(`http://${hostIP}:${port}/compile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setOutput(data.output || "No output received.");
        } catch (error) {
            console.error("Error running code:", error);
            setOutput("Error running code.");
        }
    };

    return (
        <div className="problem-page">
            {problem ? (
                <>
                    {/* Problem Description Section */}
                    <div className="problem-container">
                        <h2>{problem.title}</h2>
                        <p>
                            <strong>Difficulty:</strong> {problem.difficulty}
                        </p>
                        <div className="problem-description">
                            <strong>Description:</strong>
                            {problem.description
                                .replace(/\\n/g, "\n") // Convert escaped newlines to actual newlines
                                .split("\n")
                                .map((line: string, index: number) => (
                                    <p key={index}>{line}</p>
                                ))}
                        </div>
                    </div>

                    {/* Code Editor Section */}
                    <div className="content">
                        <select
                            className="language-selector"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="javascript">JavaScript</option>
                        </select>

                        <div className="code-editor">
                            <Editor
                                height="400px"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 18,
                                    automaticLayout: true,
                                }}
                            />
                        </div>

                        {/* Custom Test Case Input */}
                        <div className="custom-test">
                            <p>
                                <strong>Custom Test Cases:</strong>
                            </p>
                            <textarea
                                placeholder="Enter custom test cases..."
                                value={customTest}
                                onChange={(e) => setCustomTest(e.target.value)}
                            />
                        </div>

                        {/* Controls */}
                        <div className="controls">
                            <button
                                className="btn run-btn"
                                onClick={handleRunCode}
                            >
                                Run
                            </button>
                            <button className="btn submit-btn" onClick={handleSubmitCode}>Submit</button>
                        </div>

                        {/* Output Display */}
                        <div className="output-container">
                            <h3>Output:</h3>
                            <pre>{output}</pre>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading problem details...</p>
            )}
        </div>
    );
};

export default ProblemPage;
