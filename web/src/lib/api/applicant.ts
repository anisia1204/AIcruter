export async function getApplicantProfile(applicantId: string, token: string) {
  try {
    const res = await fetch(
      `${process.env
        .NEXT_PUBLIC_BACKEND_BASE_URL!}/api/applicant/profile/${applicantId}`,
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
