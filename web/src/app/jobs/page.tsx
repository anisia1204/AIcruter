import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/getUser";
import { EMPLOYMENT_TYPE, JobVO, LOCATION_TYPE } from "@/types/job";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getJobs(token: string) {
  const res = await fetch(`http://localhost:8080/api/job?page=0&size=12`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(token);
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await res.json();
  return data.content;
}

export default async function JobListingPage() {
  const { token } = await getUser();
  const jobs: JobVO[] = await getJobs(token);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-md border border-gray-200">
            <CardTitle>
              <h2 className="text-xl font-semibold px-4">{job.title}</h2>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
              <p className="text-sm text-gray-500 mb-2">
                {job.city}, {job.state} - {LOCATION_TYPE[job.locationType]}
              </p>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline">
                  {EMPLOYMENT_TYPE[job.employmentType]}
                </Badge>
                <Badge variant="secondary">{job.status}</Badge>
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
