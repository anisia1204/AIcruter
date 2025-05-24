"use client";

import { JobApplicationStatusSelect } from "@/components/JobApplicationStatusSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  JOB_APPLICATION_STATUS,
  JOB_APPLICATION_STATUS_COLORS,
  JOB_APPLICATION_STATUS_LABELS,
  JobApplicationVO,
} from "@/types/jobApplication";
import { Download, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

interface ApplicationCardProps {
  application: JobApplicationVO;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const [currentStatus, setCurrentStatus] = useState<JOB_APPLICATION_STATUS>(
    application.status
  );

  const handleDownloadResume = () => {
    if (application.resumeVO?.base64EncodedStringOfFileContent) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${application.resumeVO.base64EncodedStringOfFileContent}`;
      link.download = application.resumeVO.name;
      link.click();
    }
  };

  const handleStatusUpdate = (
    applicationId: number,
    newStatus: JOB_APPLICATION_STATUS
  ) => {
    setCurrentStatus(newStatus);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            {application.applicantFirstName} {application.applicantLastName}
          </h4>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            {application.applicantEmail && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{application.applicantEmail}</span>
              </div>
            )}
            {application.applicantTelephone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{application.applicantTelephone}</span>
              </div>
            )}
          </div>
        </div>
        <Badge className={JOB_APPLICATION_STATUS_COLORS[currentStatus]}>
          {JOB_APPLICATION_STATUS_LABELS[currentStatus]}
        </Badge>
      </div>

      {application.applicantDescription && (
        <div className="mb-3">
          <h5 className="text-sm font-medium mb-1">About</h5>
          <p className="text-sm text-gray-600 line-clamp-3">
            {application.applicantDescription}
          </p>
        </div>
      )}

      {application.applicantEducation && (
        <div className="mb-3">
          <h5 className="text-sm font-medium mb-1">Education</h5>
          <p className="text-sm text-gray-600">
            {application.applicantEducation}
          </p>
        </div>
      )}

      {application.resumeVO && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">
            Resume: {application.resumeVO.name}
          </span>
          <Button size="sm" variant="outline" onClick={handleDownloadResume}>
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        Applied on {new Date(application.createdAt).toLocaleDateString()}
      </div>

      <JobApplicationStatusSelect
        application={{ ...application, status: currentStatus }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
