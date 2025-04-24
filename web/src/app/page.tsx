import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Welcome to AIcruter
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The intelligent platform connecting recruiters and top talent.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              For Recruiters
            </h2>
            <p className="text-gray-600">
              Discover qualified candidates faster with our AI-powered matching
              and screening tools. Streamline your hiring process and find the
              perfect fit for your open roles.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              For Applicants
            </h2>
            <p className="text-gray-600">
              Explore exciting job opportunities tailored to your skills and
              experience. Create a standout profile and connect with leading
              companies in your industry.
            </p>
          </div>
        </div>
        <Link
          href="/register"
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md text-lg"
        >
          Get Started - Register Now
        </Link>
      </div>
    </div>
  );
}
