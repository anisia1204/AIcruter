"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(6),
  telephone: z.string().optional(),
  company: z.string().min(2),
  companyDetails: z
    .object({
      name: z.string().min(2),
      country: z.string().min(2),
      state: z.string().min(2),
      city: z.string().min(2),
      addressLine: z.string().min(2),
      zipCode: z.string().min(2),
    })
    .optional()
    .refine((data) => {
      if (data) {
        return Object.values(data).every((value) => !!value);
      }
      return true;
    }, "All company details are required when adding a new company."),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
        state: "",
        city: "",
        addressLine: "",
        zipCode: "",
      },
    },
  });

  const [companies, setCompanies] = useState<string[]>([]);
  const [customCompany, setCustomCompany] = useState("");
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  useEffect(() => {
    // Replace with your backend fetch
    const fetchCompanies = () => {
      setCompanies([
        "Didn’t find your company? Add a new one...",
        "Google",
        "Meta",
        "Netflix",
      ]);
    };

    fetchCompanies();
  }, []);

  const onSubmit = (data: FormData) => {
    const selectedCompany = companies.includes(data.company)
      ? data.company
      : customCompany || data.company;

    console.log("Submitted:", { ...data, company: selectedCompany });

    if (!companies.includes(selectedCompany) && data.companyDetails) {
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (rest of the form remains the same) */}

            {showCompanyForm && (
              <>
                <FormField
                  control={form.control}
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
                <div className="grid grid-cols-2 gap-4">
                  {/* ... (rest of the companyDetails fields) */}
                </div>
              </>
            )}

            {/* ... (rest of the form) */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
