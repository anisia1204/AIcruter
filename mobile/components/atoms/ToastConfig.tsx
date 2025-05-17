import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { View, Text } from 'react-native';
import { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),

  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  tomatoToast: ({ text1, props }: ToastConfigParams<any>) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato', padding: 10 }}>
      <Text>{text1 ?? 'No title'}</Text>
      <Text>{props?.uuid ?? 'No UUID'}</Text>
    </View>
  ),
};
