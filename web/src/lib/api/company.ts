import { Company } from "@/types/company";

export async function getCompanyByUserId(userId: string, token: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/company/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch company data", res.statusText);
      return { error: "Failed to fetch company data" };
    }

    const company: Company = await res.json();
    return { data: company };
  } catch (error) {
    console.error("Error fetching company data", error);
    return { error: "Unexpected error occurred" };
  }
}
