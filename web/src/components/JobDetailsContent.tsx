"use client";

import { ApplicationCard } from "@/components/ApplicationCard";
import { JobStatusToggle } from "@/components/JobStatusToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { JobApplicationVO } from "@/types/jobApplication";
import { ArrowLeft, Building2, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface JobDetailsContentProps {
  job: JobVO;
  applications: JobApplicationVO[] | null;
  applicationsError: string | null;
}

export function JobDetailsContent({
  job,
  applications,
  applicationsError,
}: JobDetailsContentProps) {
  const [currentJobStatus, setCurrentJobStatus] = useState<JOB_STATUS>(
    job.status
  );

  const handleJobStatusUpdate = (jobId: number, newStatus: JOB_STATUS) => {
    setCurrentJobStatus(newStatus);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/jobs">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{job.companyName}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {job.city}, {job.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge className={JOB_STATUS_COLORS[currentJobStatus]}>
                {JOB_STATUS_LABELS[currentJobStatus]}
              </Badge>
              <Badge className={LOCATION_TYPE_COLORS[job.locationType]}>
                {LOCATION_TYPE_LABELS[job.locationType]}
              </Badge>
              <Badge className={EMPLOYMENT_TYPE_COLORS[job.employmentType]}>
                {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
              </Badge>
            </div>

            <JobStatusToggle
              job={{ ...job, status: currentJobStatus }}
              onStatusUpdate={handleJobStatusUpdate}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Applications ({applications?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsError ? (
                <p className="text-red-600 text-sm">
                  Failed to load applications
                </p>
              ) : !applications || applications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
