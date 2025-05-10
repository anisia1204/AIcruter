import { View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import FormField from '@/components/atoms/FormField';

export const Step3Resume = () => {
 const { control } = useFormContext();

  return (
    <View>
      <Controller
        name="resume.summary"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Summary"
            placeholder="Write a brief summary..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="resume.experience"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Experience"
            placeholder="Experience details..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="resume.skills"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Skills"
            placeholder="Skills (comma-separated)..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </View>
  );
};
