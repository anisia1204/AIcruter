"use client";

import { JobStatusToggle } from "@/components/JobStatusToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  EMPLOYMENT_TYPE_COLORS,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  LOCATION_TYPE_COLORS,
} from "@/lib/utils";
import {
  EMPLOYMENT_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
  JOB_STATUS,
  JobVO,
} from "@/types/job";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface JobCardProps {
  job: JobVO;
}

export function JobCard({ job }: JobCardProps) {
  const [currentStatus, setCurrentStatus] = useState<JOB_STATUS>(job.status);

  const handleStatusUpdate = (jobId: number, newStatus: JOB_STATUS) => {
    setCurrentStatus(newStatus);
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardTitle className="flex items-center flex-wrap px-4 gap-4">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-md border-1 border-gray-200 ${JOB_STATUS_COLORS[currentStatus]} hover:opacity-90 transition`}
        >
          {JOB_STATUS_LABELS[currentStatus]}
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

        <div className="space-y-2">
          <Link href={`/jobs/${job.id}`}>
            <Button
              variant="outline"
              className="w-full justify-between cursor-pointer"
            >
              View Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <div className="mt-2">
            <JobStatusToggle
              job={{ ...job, status: currentStatus }}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
