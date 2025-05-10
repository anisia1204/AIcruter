import { useState } from 'react';
import { View } from 'react-native';
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

const steps = [
  { title: 'Account', component: Step1UserAccount },
  { title: 'Address', component: Step2Address },
  { title: 'Resume', component: Step3Resume },
];

const SignUpScreen = () => {
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

  const onNext = async () => {
  let valid = false;

  if (currentStep === 0) {
    console.log("here")
    valid = await formData.trigger('userAccount');
  } else if (currentStep === 1) {
    valid = await formData.trigger('address');
  } else if (currentStep === 2) {
    valid = await formData.trigger('resume');
  }
    console.log("Is valid:", valid);
    console.log("Errors:", formData.formState.errors);
    if (valid) setCurrentStep((prev) => prev + 1);
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
        <ThemedText type="title" style={{ textAlign: 'center', fontSize: 28 }}>
          {steps[currentStep].title} Info
        </ThemedText>

        <StepComponent />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          {currentStep > 0 && <StyledButton label="Back" onPress={onPrevious} />}
          {currentStep < steps.length - 1
            ? <StyledButton label="Next" onPress={onNext} />
            : <StyledButton label="Register" onPress={formData.handleSubmit(onSubmit)} />}
        </View>
      </AuthView>
    </FormProvider>
  );
};

export default SignUpScreen;
