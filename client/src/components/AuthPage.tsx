import { useState } from "react";
import { apiFetch } from "../helpers/api";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const endpoint = isLogin ? "/auth/login" : "/auth/register";

        try {
            const data = await apiFetch(endpoint, {
                method: "POST",
                body: JSON.stringify({email, password})
            })

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.user.email);
            window.location.reload();

        } catch(err: any){
            setError(err.message);
        }
    };

    return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Job Tracker
        </h1>

        <p className="text-gray-500 mt-2">
          Track your applications and interviews
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full !bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-medium transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-sm text-blue-600 hover:underline"
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  </div>
);
}