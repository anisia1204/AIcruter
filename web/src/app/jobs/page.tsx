import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { getCompanyJobs } from "@/lib/api/jobs";
import { isTokenExpired } from "@/lib/auth/checkToken";
import { getUser } from "@/lib/auth/getUser";
import { FileBox } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JobListingPage() {
  const { token } = await getUser();
  if (isTokenExpired(token)) redirect("/login");

  const { data: jobs, error } = await getCompanyJobs(token);

  if (error || !jobs) {
    throw new Error(error || "Failed to fetch company jobs");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Job Listings</h1>

        <Link href="/create-job">
          <Button className="w-full h-full text-lg cursor-pointer">
            <FileBox /> Create New Job
          </Button>
        </Link>
      </div>
      {jobs.length === 0 ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            <FileBox className="inline-block w-8 h-8 mr-2" />
            No Jobs Found
          </h2>
          <p className="text-gray-600 mb-4">
            Create a new job by clicking the button above.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
