import { View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import FormField from '@/components/atoms/InputFormField';

export const Step1UserAccount = () => {
  const { control } = useFormContext();

return (
    <View>
      <Controller
        name="userAccount.firstName"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="First Name"
            placeholder="First name..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="userAccount.lastName"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Last Name"
            placeholder="Last name..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="userAccount.email"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Email"
            placeholder="Email..."
            keyboardType="email-address"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="userAccount.telephone"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Phone Number"
            placeholder="Phone number..."
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="userAccount.password"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label="Password"
            placeholder="Password..."
            secureTextEntry
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </View>
  );
};
