import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

type MultiStepFormProps = {
    activeStep: number;
    steps: {
        title: string;
        component: () => React.JSX.Element;
    }[];
};

const MultiStepForm = ({activeStep, steps}: MultiStepFormProps) => {
  const { colors } = useTheme();
  return (
    <View>
      <ProgressSteps
        activeStep={activeStep}
        completedStepIconColor={colors.primary}
        activeStepIconBorderColor={colors.primary}
        completedProgressBarColor={colors.primary}
        activeStepNumColor={colors.primary}
      >
        {steps.map((step, index) => (
          <ProgressStep key={index} />
        ))}
      </ProgressSteps>
    </View>
  );
};

export default MultiStepForm;