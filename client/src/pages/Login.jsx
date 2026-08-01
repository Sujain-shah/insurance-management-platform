import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            setMessage("✅ Login Successful");

            navigate("/dashboard");
            console.log(res.data);
        } catch (err) {
            setMessage(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Insurance Management
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-lg p-3 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-lg p-3 mb-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>

                {message && (
                    <p className="text-center mt-4 font-semibold">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Login;