import { JobVO, JobStatusChangeDTO } from "@/types/job";
import { getUser } from "../auth/getUser";

export async function getAllJobs(token: string, page = 0, size = 12) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/job?page=${page}&size=${size}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data = await res.json();
    return { data: data.content as JobVO[], error: null };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { data: null, error: "Failed to fetch jobs" };
  }
}

export async function getCompanyJobs(token: string, page = 0, size = 12) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/job/company?page=${page}&size=${size}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch company jobs");
    }

    const data = await res.json();
    return { data: data.content as JobVO[], error: null };
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return { data: null, error: "Failed to fetch company jobs" };
  }
}

export async function getJobById(id: string, token: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/job/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch job details");
    }

    const job: JobVO = await res.json();
    return { data: job, error: null };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return { data: null, error: "Failed to fetch job details" };
  }
}

export async function updateJobStatus(statusChange: JobStatusChangeDTO) {
  try {
    const { token } = await getUser();
    const res = await fetch(`http://localhost:8080/api/job/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusChange),
    });

    if (!res.ok) {
      throw new Error("Failed to update job status");
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error updating job status:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update job status",
    };
  }
}
