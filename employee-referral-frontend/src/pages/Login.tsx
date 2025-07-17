import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("authToken", "dummy_token_123");
      navigate("/referral-form");
    } else {
      alert("Please enter valid credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[470px]  p-6 rounded-xl shadow-2xl bg-white font-[Quicksand]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Login
          </h1>

          <div>
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5D1D] hover:bg-[#ff5430] text-white py-2 rounded transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            <a
              href="#"
              className="text-blue-900 text-base hover:underline"
            >
              Forgot your password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
