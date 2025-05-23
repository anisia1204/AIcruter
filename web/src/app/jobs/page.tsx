import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getCompanyJobs } from "@/lib/api/jobs";
import { isTokenExpired } from "@/lib/auth/checkToken";
import { getUser } from "@/lib/auth/getUser";
import {
  EMPLOYMENT_TYPE_COLORS,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  LOCATION_TYPE_COLORS,
} from "@/lib/utils";
import { EMPLOYMENT_TYPE_LABELS, LOCATION_TYPE_LABELS } from "@/types/job";
import { ArrowRight, FileBox } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-lg border border-gray-200">
            <CardTitle className="flex items-center flex-wrap px-4 gap-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-md border-1 border-gray-200 ${
                  JOB_STATUS_COLORS[job.status]
                } hover:opacity-90 transition`}
              >
                {JOB_STATUS_LABELS[job.status]}
              </span>
            </CardTitle>
            <CardContent className="flex flex-col justify-between h-full">
              <div>
                <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {job.city}, {job.state} →{" "}
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-md border-1 border-gray-200 ${
                      LOCATION_TYPE_COLORS[job.locationType]
                    }`}
                  >
                    {LOCATION_TYPE_LABELS[job.locationType]}
                  </span>
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-md font-bold border-1 border-gray-200 ${
                    EMPLOYMENT_TYPE_COLORS[job.employmentType]
                  }`}
                >
                  {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                </span>
              </div>

              <p
                className="text-sm text-gray-700 line-clamp-3 my-4"
                title={job.description}
              >
                {job.description}
              </p>
              <Link href={`/jobs/${job.id}`}>
                <Button
                  variant="outline"
                  className="w-full justify-between cursor-pointer"
                >
                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
