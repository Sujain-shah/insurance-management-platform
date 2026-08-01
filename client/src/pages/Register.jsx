import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dob: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/customers", formData);

            setMessage("✅ Registration Successful");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Registration Failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleRegister}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg"
            >

                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Customer Registration
                </h1>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="dob"
                    className="w-full border p-3 rounded-lg mb-6"
                    onChange={handleChange}
                    required
                />

                <button
                    className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800"
                >
                    Register
                </button>

                <p className="text-center mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="text-blue-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>

                {message && (
                    <p className="text-center mt-4 font-semibold">
                        {message}
                    </p>
                )}

            </form>

        </div>
    );
}

export default Register;