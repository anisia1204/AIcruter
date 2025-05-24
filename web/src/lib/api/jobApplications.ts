import {
  JobApplicationVO,
  JobApplicationStatusChangeDTO,
} from "@/types/jobApplication";
import { getUser } from "../auth/getUser";

export async function getJobApplicationsByJobId(
  jobId: string,
  token: string,
  page = 0,
  size = 10,
  status?: string
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    const res = await fetch(
      `http://localhost:8080/api/job-application/${jobId}?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch job applications");
    }

    const data = await res.json();
    return { data: data.content as JobApplicationVO[], error: null };
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return { data: null, error: "Failed to fetch job applications" };
  }
}

export async function getAllJobApplicationsOfCurrentUser(
  token: string,
  page = 0,
  size = 10,
  status?: string
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    const res = await fetch(
      `http://localhost:8080/api/job-application?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user job applications");
    }

    const data = await res.json();
    return { data: data.content as JobApplicationVO[], error: null };
  } catch (error) {
    console.error("Error fetching user job applications:", error);
    return { data: null, error: "Failed to fetch user job applications" };
  }
}

export async function getAllJobApplicationsForJob(
  jobId: string,
  token: string
) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/job-application/${jobId}?page=0&size=100`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch job applications");
    }

    const data = await res.json();
    return {
      data: data.content as JobApplicationVO[],
      totalElements: data.totalElements,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return {
      data: null,
      totalElements: 0,
      error: "Failed to fetch job applications",
    };
  }
}

export async function updateJobApplicationStatus(
  statusChange: JobApplicationStatusChangeDTO
) {
  try {
    const { token } = await getUser();
    const res = await fetch(`http://localhost:8080/api/job-application`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusChange),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to update job application status"
      );
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error updating job application status:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update job application status",
    };
  }
}
