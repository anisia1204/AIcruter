import { JobDetailsContent } from "@/components/JobDetailsContent";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/lib/api/jobs";
import { getJobApplicationsByJobId } from "@/lib/api/jobApplications";
import { isTokenExpired } from "@/lib/auth/checkToken";
import { getUser } from "@/lib/auth/getUser";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { token } = await getUser();

  if (isTokenExpired(token)) redirect("/login");

  const { data: job, error: jobError } = await getJobById(id, token);
  const { data: applications, error: applicationsError } =
    await getJobApplicationsByJobId(id, token);

  if (jobError || !job) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{jobError || "Job not found"}</p>
          <Link href="/jobs">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <JobDetailsContent
      job={job}
      applications={applications}
      applicationsError={applicationsError}
    />
  );
}
