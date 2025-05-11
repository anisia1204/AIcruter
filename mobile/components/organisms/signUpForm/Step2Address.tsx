import { View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import FormField from '@/components/atoms/InputFormField';

export const Step2Address = () => {
  const { control } = useFormContext();

  return (
    <View>
      <Controller
        name="address.addressLine"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Street"
            placeholder="Street..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="address.city"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="City"
            placeholder="City..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="address.state"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="State"
            placeholder="State..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="address.country"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Country"
            placeholder="Country..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="address.postalCode"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Postal code"
            placeholder="Postal Code..."
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </View>
  );
};
