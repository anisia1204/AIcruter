import RegistrationForm from "@/components/RegisterForm";
import { getCompaniesDropdown } from "@/lib/api/company";

export default async function RegisterPage() {
  // Fetch companies on the server side
  const { data: companies, error } = await getCompaniesDropdown();

  return (
    <main className="flex justify-center flex-col items-center">
      <h1 className="text-2xl font-bold">Register to AIcruter for free</h1>

      <div className="w-full min-w-[500px] mb-4">
        <RegistrationForm initialCompanies={companies || []} />
      </div>
    </main>
  );
}
