import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledButton } from "@/components/atoms/StyledButton";
import AuthView from "@/components/templates/AuthView";
import { ThemedText } from "@/components/ThemedText";
import { BASE_URL } from "@/lib/api";
import { router } from "expo-router";
import { Step1UserAccount } from "@/components/organisms/signUpForm/Step1UserAccount";
import { Step2Address } from "@/components/organisms/signUpForm/Step2Address";
import { Step3Resume } from "@/components/organisms/signUpForm/Step3Resume";
import { fullApplicantSchema } from "@/schemas/applicantSchema";
import { useTheme } from "@react-navigation/native";
import MultiStepForm from "@/components/atoms/MultiStepForm";
import Toast from "react-native-toast-message";

const steps = [
  { title: "Account", component: Step1UserAccount },
  { title: "Address", component: Step2Address },
  { title: "Resume", component: Step3Resume },
];

const SignUpScreen = () => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const formData = useForm({
    resolver: zodResolver(fullApplicantSchema),
    mode: "onSubmit",
    defaultValues: {
      userAccount: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        telephone: "",
        role: "APPLICANT",
        //picture: '',
      },
      address: {
        country: "",
        city: "",
        addressLine: "",
        state: "",
        postalCode: "",
      },
      resume: {
        resumeFile: {
          uri: "",
          name: "",
          size: 0,
          mimeType: "",
        },
        description: "",
        education: "",
      },
    },
  });

  const StepComponent = steps[currentStep].component;
  const fieldGroups = ["userAccount", "address", "resume"] as const;

  const onNext = async () => {
    const currentGroup = fieldGroups[currentStep];
    const groupValues = formData.getValues(currentGroup);

    const fields = Object.keys(groupValues).map(
      (field) => `${currentGroup}.${field}` as const
    );

    fields.forEach((fieldName) => {
      formData.setValue(
        fieldName as any,
        formData.getValues(fieldName as any),
        {
          shouldTouch: true,
        }
      );
    });

    const valid = await formData.trigger(fields as any);

    if (valid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const onPrevious = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      const file = data.resume.resumeFile;
      if (!file) return;

      formData.append("resume", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);

      const applicantDTO = {
        userAccountDTO: data.userAccount,
        addressDTO: data.address,
        description: data.resume.description,
        education: data.resume.education,
      };

      formData.append("applicantDTO", JSON.stringify(applicantDTO));

      const response = await fetch(`${BASE_URL}/api/applicant/register`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });

      console.log(BASE_URL);
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Registration failed",
          visibilityTime: 5000,
        });
        throw new Error("Registration failed");
      }

      Toast.show({
        type: "success",
        text1: "Check your email!",
        visibilityTime: 5000,
      });
      router.replace("../sign-in");
    } catch (e) {
      console.warn("Submission error:", e);
    }
  };

  return (
    <FormProvider {...formData}>
      <MultiStepForm activeStep={currentStep} steps={steps} />

      <AuthView>
        <ThemedText type="title" style={styles.title}>
          {steps[currentStep].title} Info
        </ThemedText>

        <StepComponent />

        <View style={styles.buttonContainer}>
          <StyledButton
            label="Back"
            onPress={onPrevious}
            disabled={currentStep === 0}
          />
          {currentStep < steps.length - 1 ? (
            <StyledButton label="Next Step" onPress={onNext} />
          ) : (
            <StyledButton
              label="Register"
              onPress={formData.handleSubmit(onSubmit)}
            />
          )}
        </View>

        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>
            Already have an account?{" "}
            <Text
              style={[styles.signUpLink, { color: colors.primary }]}
              onPress={() => router.replace("../sign-in")}
            >
              Sign in here.
            </Text>
          </Text>
        </View>
      </AuthView>
    </FormProvider>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  signUpTextContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
    color: "#333",
  },
  signUpLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
