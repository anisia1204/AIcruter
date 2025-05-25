import { getUser } from "@/lib/auth/getUser";
import { getCompanyByUserId } from "@/lib/api/company";
import { redirect } from "next/navigation";
import CompanyProfileForm from "@/components/CompanyProfileForm";

export default async function ProfilePage() {
  const { isAuthenticated, token, userId, firstName, lastName } =
    await getUser();

  if (!isAuthenticated) redirect("/login");

  const { data: company, error } = await getCompanyByUserId(userId!, token!);

  if (error || !company) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            Failed to load company profile: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
        <p className="text-gray-600">
          Welcome,{" "}
          <span className="font-semibold">
            {firstName} {lastName}
          </span>
          ! Manage your company information and settings.
        </p>
      </div>

      <CompanyProfileForm company={company} token={token!} />
    </div>
  );
}
