import CreateJobForm from "@/components/CreateJobForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function CreateJobApplicationPage() {
  const { isAuthenticated, companyId } = await getUser();

  if (!isAuthenticated) redirect("/login");

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-2xl">
      <CardTitle className="px-6">Create Job Listing</CardTitle>

      <CardContent className="px-6">
        <CreateJobForm companyId={companyId ?? ""} />
      </CardContent>
    </Card>
  );
}
