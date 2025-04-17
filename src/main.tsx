import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function MockAuthenticator({ children }: { children: (props: any) => JSX.Element }) {
    const [user, setUser] = useState<{ loginId: string } | null>(null);

    if (!user) {
        const handleLogin = () => {
            const loginId = window.prompt("Enter your login ID:");
            if (loginId) setUser({ loginId });
        };
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <h1>Login</h1>
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    }

    return children({ user, signOut: () => setUser(null) });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
		<MockAuthenticator>
            {({ signOut, user }) => <App user={user} signOut={signOut} />}
        </MockAuthenticator>
    </React.StrictMode>
);