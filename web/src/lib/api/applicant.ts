export async function getApplicantProfile(applicantId: string, token: string) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/applicant/profile/${applicantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch applicant profile", res.statusText);
      return { error: "Failed to fetch applicant profile" };
    }

    const profile = await res.json();
    return { data: profile };
  } catch (error) {
    console.error("Error fetching applicant profile", error);
    return { error: "Unexpected error occurred" };
  }
}
