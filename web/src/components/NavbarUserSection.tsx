import { getUser } from "@/lib/auth/getUser";
import { getCompanyByUserId } from "@/lib/api/company";
import { UserCircle, Building2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignOutButton } from "@/components/SignOutButton";
import CompanyAvatar from "@/components/CompanyAvatar";
import Link from "next/link";

export default async function NavbarUserSection() {
  const { isAuthenticated, token, userId, firstName, lastName } =
    await getUser();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-gray-700 hover:text-gray-900">
          Login
        </Link>
        <Link
          href="/register"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const { data: company, error } = await getCompanyByUserId(userId!, token!);

  return (
    <div className="flex items-center gap-3">
      {company && !error && (
        <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors">
          <CompanyAvatar companyName={company.name} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 truncate max-w-fit">
              {company.name}
            </span>
            <span className="text-xs text-gray-600 truncate max-w-fit">
              {company.legalAddressDTO.city}, {company.legalAddressDTO.state}
            </span>
          </div>
        </div>
      )}

      {company && !error && (
        <div className="md:hidden">
          <CompanyAvatar companyName={company.name} size="sm" />
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/30">
            <UserCircle className="w-5 h-5 text-gray-700" />
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800 truncate max-w-fit">
                {firstName} {lastName}
              </span>
              <span className="text-xs text-gray-600">Recruiter</span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1.5 border-b">
              <p className="text-sm font-medium">
                {firstName} {lastName}
              </p>
              <p className="text-xs text-gray-500">Recruiter Account</p>
            </div>

            {company && !error && (
              <div className="md:hidden px-2 py-1.5 border-b">
                <div className="flex items-center gap-2">
                  <CompanyAvatar companyName={company.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{company.name}</p>
                    <p className="text-xs text-gray-500">
                      {company.legalAddressDTO.city},{" "}
                      {company.legalAddressDTO.state}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Company Profile
            </Link>

            <div className="border-t pt-2">
              <SignOutButton />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
