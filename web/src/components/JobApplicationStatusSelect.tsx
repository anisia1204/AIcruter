"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateJobApplicationStatus } from "@/lib/api/jobApplications";
import {
  JOB_APPLICATION_STATUS,
  JOB_APPLICATION_STATUS_LABELS,
  JOB_APPLICATION_STATUS_TRANSITIONS,
  JobApplicationVO,
} from "@/types/jobApplication";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JobApplicationStatusSelectProps {
  application: JobApplicationVO;
  onStatusUpdate?: (
    applicationId: number,
    newStatus: JOB_APPLICATION_STATUS
  ) => void;
}

export function JobApplicationStatusSelect({
  application,
  onStatusUpdate,
}: JobApplicationStatusSelectProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<JOB_APPLICATION_STATUS | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableStatuses =
    JOB_APPLICATION_STATUS_TRANSITIONS[application.status] || [];

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus as JOB_APPLICATION_STATUS);
  };

  const handleUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await updateJobApplicationStatus({
        id: application.id,
        status: selectedStatus,
      });

      if (error) {
        toast.error("Failed to update status", {
          description: error,
        });
      } else {
        toast.success("Status updated successfully");
        onStatusUpdate?.(application.id, selectedStatus);
        setSelectedStatus(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(null);
  };

  if (availableStatuses.length === 0) {
    return null; // No status transitions available
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      {selectedStatus ? (
        <>
          <div className="text-sm text-gray-600">
            Change to:{" "}
            <span className="font-medium">
              {JOB_APPLICATION_STATUS_LABELS[selectedStatus]}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="h-7 px-2"
          >
            {isUpdating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
            className="h-7 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </>
      ) : (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40 h-7 text-xs">
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {JOB_APPLICATION_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
