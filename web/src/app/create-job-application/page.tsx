import CreateJobApplicationForm from "@/components/CreateJobApplicationForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default async function CreateJobApplicationPage() {
  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-2xl">
      <CardTitle className="px-6">Create Job Listing</CardTitle>

      <CardContent className="px-6">
        <CreateJobApplicationForm applicantId={"14"} />
      </CardContent>
    </Card>
  );
}
