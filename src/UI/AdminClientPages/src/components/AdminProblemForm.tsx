import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/AdminProblemForm.css";

interface ProblemData {
  id?: string; // NEW: id as string for form control
  title?: string;
  difficulty?: string;
  tags?: string;
  description?: string;
  code?: string;
  language?: string;
  cases?: string;
}

interface AdminProblemFormProps {
  formTitle: string;
  initialData?: ProblemData;
  onSubmit: (data: ProblemData) => void;
}

const AdminProblemForm: React.FC<AdminProblemFormProps> = ({
  formTitle,
  initialData = {},
  onSubmit,
}) => {
  const [id, setId] = useState(initialData.id || "");
  const [title, setTitle] = useState(initialData.title || "");
  const [difficulty, setDifficulty] = useState(initialData.difficulty || "Easy");
  const [tags, setTags] = useState(initialData.tags || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [code, setCode] = useState(initialData.code || "// Write sample code here");
  const [language, setLanguage] = useState(initialData.language || "java");
  const [cases, setCases] = useState(initialData.cases || "");

  useEffect(() => {
    if (initialData.id || initialData.title || initialData.description || initialData.code) {
      setId(initialData.id || "");
      setTitle(initialData.title || "");
      setDifficulty(initialData.difficulty || "Easy");
      setTags(initialData.tags || "");
      setDescription(initialData.description || "");
      setCode(initialData.code || "// Write sample code here");
      setLanguage(initialData.language || "java");
      setCases(initialData.cases || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const problemData: ProblemData = {
      id,
      title,
      difficulty,
      tags,
      description,
      code,
      language,
      cases,
    };
    console.log("Submitted Problem Data:", problemData);
    onSubmit(problemData);
  };

  return (
    <div className="admin-form-container">
      <h2 className="form-title">{formTitle}</h2>
      <form onSubmit={handleSubmit}>
        <label>ID</label>
        <input
          className="form-input"
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <label>Title</label>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Difficulty</label>
        <select
          className="form-input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <label>Tags (comma-separated)</label>
        <input
          className="form-input"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <label>Description</label>
        <textarea
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />

        {/* Bootstrap Dropdown for Language Selection */}
        <div className="dropdown mb-3">
          <button
            className="btn btn-dark dropdown-toggle"
            type="button"
            id="languageDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {language.toUpperCase()}
          </button>
          <ul className="dropdown-menu" aria-labelledby="languageDropdown">
            {["java", "javascript", "python", "c", "cpp"].map((lang) => (
              <li key={lang}>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label>Sample Code</label>
        <div className="editor-container">
          <Editor
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        </div>
        <label>Test Cases</label>
          <textarea
            className="form-input"
            value={cases}
            onChange={(e) => setCases(e.target.value)}
            rows={5}
            placeholder={`Example:\nInput: 5\nOutput: 25\n\nInput: 2\nOutput: 4`}
          />

        <button type="submit" className="submit-btn btn btn-success mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminProblemForm;
