import { Company } from "@/types/company";

export async function getCompanyByUserId(userId: string, token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL!}/api/company/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        cache: "no-store",
      }
    );

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

export async function getCompanyProfile(companyId: string, token: string) {
  try {
    const res = await fetch(
      `${process.env
        .NEXT_PUBLIC_BACKEND_BASE_URL!}/api/company/profile/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch company profile", res.statusText);
      return { error: "Failed to fetch company profile" };
    }

    const profile = await res.json();
    return { data: profile };
  } catch (error) {
    console.error("Error fetching company profile", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function updateCompany(companyData: Company, token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL!}/api/company`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(companyData),
      }
    );

    if (!res.ok) {
      const errors = await res.json();
      console.error("Registration failed:", errors);
      return { error: errors.globalError || "Failed to update company" };
    }

    const updatedCompany = await res.json();
    return { data: updatedCompany };
  } catch (error) {
    console.error("Error updating company", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function getCompaniesDropdown() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL!}/api/company/dropdown`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch companies dropdown", res.statusText);
      return { error: "Failed to fetch companies dropdown" };
    }

    const companies = await res.json();
    return { data: companies };
  } catch (error) {
    console.error("Error fetching companies dropdown", error);
    return { error: "Unexpected error occurred" };
  }
}
