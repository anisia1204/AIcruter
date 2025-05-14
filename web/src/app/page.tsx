"use client";

import { motion } from "framer-motion";
import { Briefcase, User } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="py-24">
      <div className="container mx-auto text-center px-4">
        <motion.h1
          className="text-5xl font-extrabold text-indigo-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to AIcruter
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The intelligent platform connecting recruiters and top talent with
          <br />
          <span className="font-bold underline">AI-powered</span> precision.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow p-6 text-left border">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-800">
                For Recruiters
              </h2>
            </div>
            <p className="text-gray-600">
              Discover qualified candidates faster with our AI-powered matching
              tools. Streamline your hiring and find the perfect fit
              effortlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-left border">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-800">
                For Applicants
              </h2>
            </div>
            <p className="text-gray-600">
              Explore jobs tailored to your skills and experience. Create a
              standout profile and connect with top companies.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition"
          >
            🚀 Get Started - Register Now
          </Link>
          <span className="text-gray-500 font-bold">OR</span>
          <Link
            href="/login"
            className="inline-block bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-500 font-semibold py-3 px-8 rounded-lg text-lg transition"
          >
            🔐 Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
