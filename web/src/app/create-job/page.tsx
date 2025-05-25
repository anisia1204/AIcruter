import CreateJobForm from "@/components/CreateJobForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getCompanyByUserId } from "@/lib/api/company";
import { getUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function CreateJobPage() {
  const { isAuthenticated, userId, token } = await getUser();

  if (!isAuthenticated) redirect("/login");

  const { data: company, error } = await getCompanyByUserId(userId, token);

  if (error || !company) {
    console.error(error);
    return <p className="text-red-800">Error retrieving company data...</p>;
  }

  return (
    <Card className="max-w-md mx-auto mt-32 shadow-xl rounded-2xl">
      <CardTitle className="px-6">Create Job Listing</CardTitle>

      <CardContent className="px-6">
        <CreateJobForm companyId={company.id.toString() ?? ""} token={token} />
      </CardContent>
    </Card>
  );
}
