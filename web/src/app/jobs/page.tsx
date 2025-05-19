import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { isTokenExpired } from "@/lib/auth/checkToken";
import { getUser } from "@/lib/auth/getUser";
import {
  EMPLOYMENT_TYPE_COLORS,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  LOCATION_TYPE_COLORS,
} from "@/lib/utils";
import {
  EMPLOYMENT_TYPE_LABELS,
  JobVO,
  LOCATION_TYPE_LABELS,
} from "@/types/job";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getJobs(token: string) {
  const res = await fetch(`http://localhost:8080/api/job?page=0&size=12`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await res.json();
  return data.content;
}

export default async function JobListingPage() {
  const { token } = await getUser();
  if (isTokenExpired(token)) redirect("/login");

  const jobs: JobVO[] = await getJobs(token);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
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
            <CardContent>
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
              <div className="flex gap-2 mb-4">
                <span
                  className={`text-xs px-3 py-1 rounded-md font-bold border-1 border-gray-200 ${
                    EMPLOYMENT_TYPE_COLORS[job.employmentType]
                  }`}
                >
                  {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">
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
