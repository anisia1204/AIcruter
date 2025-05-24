"use client";

import { Button } from "@/components/ui/button";
import { updateJobStatus } from "@/lib/api/jobs";
import { JOB_STATUS, JobVO } from "@/types/job";
import { Loader2, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JobStatusToggleProps {
  job: JobVO;
  onStatusUpdate?: (jobId: number, newStatus: JOB_STATUS) => void;
}

export function JobStatusToggle({ job, onStatusUpdate }: JobStatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const newStatus =
    job.status === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;

  const toggleStatus = async () => {
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
      console.error(error);
      toast.error("Failed to update job status", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const icon =
    newStatus === JOB_STATUS.CLOSED ? (
      <Lock className="w-4 h-4" />
    ) : (
      <Unlock className="w-4 h-4" color="green" />
    );
  const label = newStatus === JOB_STATUS.CLOSED ? "Close job" : "Open job";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleStatus}
      disabled={isUpdating}
      className="flex items-center gap-2 text-gray-600 hover:text-black"
    >
      {isUpdating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
