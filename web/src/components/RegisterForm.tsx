"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCompaniesDropdown } from "@/lib/api/company";
import { CompanyDropdownItem } from "@/types/company";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(6),
  telephone: z.string().optional(),
  company: z.string().min(1),
  companyDetails: z
    .object({
      name: z.string().min(2),
      country: z.string().min(2),
      city: z.string().min(2),
      postalCode: z.string().min(2),
      addressLine: z.string().min(2),
      state: z.string().min(2),
    })
    .optional()
    .nullable(),
});

const otherSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(6),
  telephone: z.string().optional(),
  company: z.string().min(1),
  companyDetails: z
    .object({
      name: z.string(),
      country: z.string(),
      city: z.string(),
      postalCode: z.string(),
      addressLine: z.string(),
      state: z.string(),
    })
    .optional()
    .nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  initialCompanies?: CompanyDropdownItem[];
}

export default function RegistrationForm({
  initialCompanies = [],
}: RegistrationFormProps) {
  const [companies, setCompanies] =
    useState<CompanyDropdownItem[]>(initialCompanies);
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(isNewCompany ? formSchema : otherSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      telephone: "",
      company: "",
      companyDetails: {
        name: "",
        country: "",
        city: "",
        postalCode: "",
        addressLine: "",
        state: "",
      },
    },
  });

  useEffect(() => {
    // Only fetch companies if not provided as props
    if (initialCompanies.length === 0) {
      const loadCompanies = async () => {
        try {
          const { data, error } = await getCompaniesDropdown();
          if (error) {
            console.error("Failed to load companies:", error);
            // Fallback to empty array
            setCompanies([]);
          } else {
            setCompanies(data || []);
          }
        } catch (err) {
          console.error("Error loading companies:", err);
          setCompanies([]);
        }
      };

      loadCompanies();
    }
  }, [initialCompanies]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      userAccountDTO: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        telephone: data.telephone,
        role: "EMPLOYER",
      },
      companyDTO: {
        id: isNewCompany ? null : parseInt(data.company as string),
        name: isNewCompany ? data.companyDetails?.name : "",
        legalAddressDTO: isNewCompany
          ? {
              country: data.companyDetails?.country,
              city: data.companyDetails?.city,
              postalCode: data.companyDetails?.postalCode,
              addressLine: data.companyDetails?.addressLine,
              state: data.companyDetails?.state,
            }
          : null,
      },
      role: null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL!}/api/employer/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errors = await response.json();
        console.error("Registration failed:", errors);
        toast.error(errors.globalError);

        if (errors) {
          Object.keys(errors).forEach((key) => {
            form.setError(key as keyof FormData, {
              type: "server",
              message: errors.globalError,
            });
          });
        } else {
          toast.error(errors.globalError);
          console.error("Registration failed with an unknown error.");
        }
        return;
      }

      router.push("/");
      toast.success("Success!");
    } catch (err) {
      console.error("Error submitting registration form", err);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {companies.find(
                            (c) => c.id.toString() === field.value.toString()
                          )?.name || "Select a company"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search company..." />
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="new"
                            onSelect={() => {
                              field.onChange("new");
                              setIsNewCompany(true);
                              setOpen(false);
                            }}
                          >
                            + New company...
                          </CommandItem>
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.id.toString()} // Set the value to the company ID
                              onSelect={() => {
                                field.onChange(company.id.toString()); // Store the ID in the form
                                setIsNewCompany(false);
                                setOpen(false);
                              }}
                              className="flex justify-start"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {company.name} {/* Display the company name */}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isNewCompany && (
              <>
                <FormField
                  name="companyDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyDetails.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyDetails.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyDetails.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyDetails.addressLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyDetails.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full cursor-pointer mt-4">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
