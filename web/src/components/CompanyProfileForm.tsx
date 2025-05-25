"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompany } from "@/lib/api/company";
import { Company, EmployerVO } from "@/types/company";
import { toast } from "sonner";
import { Building2, Users, MapPin, Save } from "lucide-react";

const companySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Company name is required"),
  legalAddressDTO: z.object({
    addressLine: z.string().min(1, "Address line is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    state: z.string().min(1, "State is required"),
  }),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyProfileFormProps {
  company: Company;
  token: string;
}

export default function CompanyProfileForm({
  company,
  token,
}: CompanyProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: company.id,
      name: company.name,
      legalAddressDTO: company.legalAddressDTO,
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      const { error } = await updateCompany(data, token);

      if (error) {
        toast.error(error || "Failed to update company profile");
        console.error("Update error:", error);
      } else {
        toast.success("Company profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Company Information Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" {...form.register("name")} className="mt-1" />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Legal Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...form.register("legalAddressDTO.country")}
                      className="mt-1"
                    />
                    {form.formState.errors.legalAddressDTO?.country && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.legalAddressDTO.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...form.register("legalAddressDTO.state")}
                      className="mt-1"
                    />
                    {form.formState.errors.legalAddressDTO?.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.legalAddressDTO.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...form.register("legalAddressDTO.city")}
                      className="mt-1"
                    />
                    {form.formState.errors.legalAddressDTO?.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.legalAddressDTO.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      {...form.register("legalAddressDTO.postalCode")}
                      className="mt-1"
                    />
                    {form.formState.errors.legalAddressDTO?.postalCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {
                          form.formState.errors.legalAddressDTO.postalCode
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine">Address Line</Label>
                  <Input
                    id="addressLine"
                    {...form.register("legalAddressDTO.addressLine")}
                    className="mt-1"
                  />
                  {form.formState.errors.legalAddressDTO?.addressLine && (
                    <p className="text-sm text-red-600 mt-1">
                      {
                        form.formState.errors.legalAddressDTO.addressLine
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Updating..." : "Update Company Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Company Employees */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Company Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {company.employerVOs && company.employerVOs.length > 0 ? (
              <div className="space-y-4">
                {company.employerVOs.map((employee: EmployerVO) => (
                  <div key={employee.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                    <p className="text-sm text-gray-600">
                      {employee.telephone}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {employee.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No employees found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
