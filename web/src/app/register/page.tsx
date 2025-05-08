import RegistrationForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex justify-center flex-col items-center">
      <h1 className="text-2xl font-bold">Register to AIcruter for free</h1>

      <div className="w-full min-w-[500px] mb-4">
        <RegistrationForm />
      </div>
    </main>
  );
}
