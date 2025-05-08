import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

type StyledButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
};

export const StyledButton = ({ label, onPress, variant = 'solid' }: StyledButtonProps) => {

 const { colors } = useTheme();
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          backgroundColor: isOutline ? 'transparent' : colors.primary,
          borderColor: colors.primary,
          borderWidth: isOutline ? 2 : 0,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: isOutline ? colors.primary : '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
