import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyledButton } from '@/components/atoms/StyledButton';
import AuthView from '@/components/templates/AuthView';
import { ThemedText } from '@/components/ThemedText';
import { apiPost } from '@/lib/api';
import { router } from 'expo-router';
import { Step1UserAccount } from '@/components/organisms/signUpForm/Step1UserAccount';
import { Step2Address } from '@/components/organisms/signUpForm/Step2Address';
import { Step3Resume } from '@/components/organisms/signUpForm/Step3Resume';
import { fullApplicantSchema } from '@/schemas/applicantSchema';
import { useTheme } from '@react-navigation/native';

const steps = [
  { title: 'Account', component: Step1UserAccount },
  { title: 'Address', component: Step2Address },
  { title: 'Resume', component: Step3Resume },
];

const SignUpScreen = () => {

  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const formData = useForm({
    resolver: zodResolver(fullApplicantSchema),
    mode: 'onSubmit',
    defaultValues: {
      userAccount: {
        firstName: '',
        lastName: '',
        email: '',
        passwordHash: '',
        telephone: '',
        userRole: 'APPLICANT',
        //picture: '',
      },
      address: {
        country: '',
        city: '',
        addressLine: '',
        state: '',
        postalCode: '',
      },
      resume: {
        resume: null,
        description: '',
        education: '',
      },
    }
  });

  const StepComponent = steps[currentStep].component;
  const fieldGroups = ['userAccount', 'address', 'resume'] as const;

  const onNext = async () => {
    const currentGroup = fieldGroups[currentStep];
    const groupValues = formData.getValues(currentGroup);

    const fields = Object.keys(groupValues).map(
      (field) => `${currentGroup}.${field}` as const
    );

    fields.forEach((fieldName) => {
      formData.setValue(fieldName as any, formData.getValues(fieldName as any), {
        shouldTouch: true,
      });
    });

    const valid = await formData.trigger(fields as any);

    console.log("Is valid:", valid);
    console.log("Errors:", formData.formState.errors);

    if (valid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const onPrevious = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        userAccountDTO: data.userAccount,
        addressDTO: data.address,
        resumeDTO: {
          name: data.resume.resume.name,
          size: data.resume.resume.size,
          content: await data.resume.resume.content.arrayBuffer(),
        },
        description: data.resume.description,
        education: data.resume.education,
      };
      delete payload.userAccount;
      delete payload.address;
      delete payload.resume;

      console.log("payload", JSON.stringify(payload))
      //await apiPost('/api/applicant/register', payload);
      //router.replace('../');
    } catch (e) {
      console.warn('Submission error:', e);
    }
  };

  return (
    <FormProvider {...formData}>
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
            <StyledButton label="Register" onPress={formData.handleSubmit(onSubmit)} />
          )}
        </View>

        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>
            Already have an account?{' '}
            <Text
              style={[styles.signUpLink, { color: colors.primary }]}
              onPress={() => router.replace('../sign-in')}
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
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  signUpTextContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#333',
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
