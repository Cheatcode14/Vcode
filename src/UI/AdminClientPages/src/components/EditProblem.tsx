import { useParams } from "react-router-dom";
import AdminProblemForm from "./AdminProblemForm";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
const EditProblem = () => {
    const { port,hostIP } = useUser();
    const { id } = useParams();
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`http://${hostIP}:${port}/question/${id}`) // Replace PORT with your backend port
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch problem data");
                }
                return res.json();
            })
            .then((data) => {
                setInitialData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching problem:", err);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (formData: any) => {
        const payload = {
            id: id,
            title: formData.title,
            diff: formData.difficulty,
            desc: formData.description,
            tags: (formData.tags || "")
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0),
            code: formData.code,
            cases: formData.cases
        };
    
        console.log("📤 Updating Problem Data:", payload);
    
        try {
            const response = await fetch(`http://${hostIP}:${port}/updateQuestion`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                alert("✅ Question successfully updated in Firebase!");
            } else {
                const errText = await response.text();
                console.error("❌ Server Error Response:", errText);
                alert("❌ Failed to update question on server.");
            }
        } catch (error) {
            console.error("⚠️ Error reaching server:", error);
            alert("⚠️ Could not reach server.");
        }
    };
    

    if (loading) {
        return <p>Loading problem data...</p>;
    }

    if (!initialData) {
        return <p>Problem not found.</p>;
    }

    return (
        <AdminProblemForm
        formTitle={`Edit Problem #${initialData.title}`}
        initialData={{
            ...initialData,
            tags: Array.isArray(initialData.tags)
                ? initialData.tags.join(", ")
                : initialData.tags || "",
        }}
        onSubmit={handleSubmit}
    />
    
    );
};

export default EditProblem;
