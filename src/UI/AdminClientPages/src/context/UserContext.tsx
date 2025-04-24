import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    email: string | null;
    role: "teacher" | "student" | null;
    port: string | null;
    hostIP: string;
    userName: string;
}

const UserContext = createContext<UserContextType>({
    email: null,
    role: null,
    port: null,
    hostIP: "192.168.67.185",
    userName: "", // Fixed the syntax and provided a default string
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<"teacher" | "student" | null>(null);
    const [port, setPort] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>(""); // Added state for userName
    const hostIP = "192.168.67.185";

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        const storedRole = localStorage.getItem("userRole") as "teacher" | "student" | null;
        const storedPort = localStorage.getItem("userPort");
        const storedName = localStorage.getItem("userName");

        setEmail(storedEmail);
        setRole(storedRole);
        setPort(storedPort);
        setUserName(storedName || "");
    }, []);

    return (
        <UserContext.Provider value={{ email, role, port, hostIP, userName }}>
            {children}
        </UserContext.Provider>
    );
};
