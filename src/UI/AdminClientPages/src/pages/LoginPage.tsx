import { useEffect, useState, useRef } from "react";
import "../styles/LoginStyle.css";

const LoginPage = () => {
    const [isLightMode, setIsLightMode] = useState(false);
    const [command, setCommand] = useState("");
    const [output, setOutput] = useState<string[]>([]);
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(0);
    const [wrongPass, setWrongPass] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputEndRef = useRef<HTMLDivElement>(null);

    // Initialize terminal
    useEffect(() => {
        const initialText = [
            "> Welcome to Vcode.",
            "> Please enter your username:",
        ];

        let currentLine = 0;
        let currentChar = 0;
        let timeout: NodeJS.Timeout;

        const typeText = () => {
            if (currentLine < initialText.length) {
                if (currentChar < initialText[currentLine].length) {
                    setOutput((prev) => {
                        const newOutput = [...prev];
                        if (!newOutput[currentLine]) {
                            newOutput[currentLine] = "";
                        }
                        newOutput[currentLine] = initialText[
                            currentLine
                        ].substring(0, currentChar + 1);
                        return newOutput;
                    });
                    currentChar++;
                    timeout = setTimeout(typeText, 50);
                } else {
                    currentLine++;
                    currentChar = 0;
                    if (currentLine < initialText.length) {
                        setOutput((prev) => [...prev, ""]); // Add new line
                    }
                    timeout = setTimeout(typeText, 50);
                }
            } else {
                setIsTyping(false);
                inputRef.current?.focus();
            }
        };

        typeText();

        return () => clearTimeout(timeout);
    }, []);

    // Auto-scroll to bottom when output changes
    useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [output]);

    const printLine = (text: string, delay = 500) => {
        setTimeout(() => {
            setOutput((prev) => [...prev, text]);
        }, delay);
    };

    const processCommand = (cmd: string) => {
        if (cmd === "forgot --help") {
            printLine("> Redirecting to Forgot Password page...");
            setTimeout(() => {
                window.location.href = "ForgotPass.html";
            }, 1000);
            return;
        }

        if (step === 0) {
            setUsername(cmd);
            printLine(`\n> Username accepted`);
            printLine(`> Enter password:`);
            setStep(1);
        } else if (step === 1) {
            if (cmd === "password123") {
                printLine("> Access granted. Welcome, " + username + "!", 1000);
                printLine("> Initializing secure session...", 1500);
                printLine("> Connection Established.", 2500);
            } else {
                setWrongPass((prev) => prev + 1);
                printLine("> ERROR: Incorrect password. Try again.");
                if (wrongPass > 2) {
                    printLine(
                        `> Forgot password? Type 'forgot --help' for assistance.`
                    );
                }
            }
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const cmd = (e.target as HTMLInputElement).value.trim();
            (e.target as HTMLInputElement).value = "";
            setCommand("");
            processCommand(cmd);
        } else {
            setCommand((e.target as HTMLInputElement).value);
        }
    };

    const toggleMode = () => {
        setIsLightMode((prev) => !prev);
    };

    return (
        <div className={`login-container ${isLightMode ? "light-mode" : ""}`}>
            <center>
                <h1 className="sign-in-title">Sign In</h1>
            </center>

            <div className="container">
                <div className="toggle-container">
                    <button id="mode-toggle" onClick={toggleMode}>
                        {isLightMode ? "🌙 Dark Mode" : "🌞 Light Mode"}
                    </button>
                </div>

                <div className="separator"></div>

                <div className="terminal">
                    <div className="terminal-header">
                        <div className="buttons">
                            <span className="button close"></span>
                            <span className="button minimize"></span>
                            <span className="button maximize"></span>
                        </div>
                        <div>
                            <span className="title">root@vcode:~$</span>
                        </div>
                    </div>
                    <div className="terminal-body">
                        {output.map((line, index) => (
                            <pre key={index}>{line}</pre>
                        ))}
                        <div className="input-line">
                            <span className="prompt">{">"} </span>
                            <span id="command">{command}</span>
                            <span className="cursor">█</span>
                            <input
                                type="text"
                                id="terminal-input"
                                ref={inputRef}
                                autoFocus
                                autoComplete="off"
                                onKeyUp={handleKeyUp}
                                disabled={isTyping}
                            />
                        </div>
                        <div ref={outputEndRef} />
                    </div>
                </div>

                <div className="sign-up-container">
                    <a href="Signup.html" className="sign-up-link">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
