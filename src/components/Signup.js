import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/"); // Redirect to login after signup
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Image */}
      <div className="hidden md:flex w-1/2 bg-sky-400 items-center justify-center">
        <img
          src="https://i.pinimg.com/736x/48/17/2d/48172dc2448b4bb1dcce3ef929ab3082.jpg" // Replace with your preferred illustration URL
          alt="Signup Illustration"
          className="w-3/4"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-sky-50 px-8 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-sky-600 mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Sign up to get started</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
                required
              />
            </div>
             <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                
                <option value="fishermen">Fishermen</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-sky-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;



