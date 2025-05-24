"use client";

import { Button } from "@/components/ui/button";
import { updateJobStatus } from "@/lib/api/jobs";
import { JOB_STATUS, JOB_STATUS_LABELS, JobVO } from "@/types/job";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JobStatusToggleProps {
  job: JobVO;
  onStatusUpdate?: (jobId: number, newStatus: JOB_STATUS) => void;
}

export function JobStatusToggle({ job, onStatusUpdate }: JobStatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    const newStatus =
      job.status === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;

    setIsUpdating(true);
    try {
      const { error } = await updateJobStatus({
        id: job.id,
        status: newStatus,
      });

      if (error) {
        toast.error("Failed to update job status", {
          description: error,
        });
      } else {
        toast.success(`Job ${newStatus.toLowerCase()} successfully`);
        onStatusUpdate?.(job.id, newStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update job status", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const newStatus =
    job.status === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;

  return (
    <Button
      variant={job.status === JOB_STATUS.OPEN ? "destructive" : "default"}
      size="sm"
      onClick={toggleStatus}
      disabled={isUpdating}
      className="min-w-20"
    >
      {isUpdating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        `Mark as ${JOB_STATUS_LABELS[newStatus]}`
      )}
    </Button>
  );
}
