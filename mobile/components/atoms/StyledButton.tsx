import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

type StyledButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
};

export const StyledButton = ({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
}: StyledButtonProps) => {
  const { colors } = useTheme();
  const isOutline = variant === 'outline';

  const backgroundColor = disabled
    ? '#ccc'
    : isOutline
    ? 'transparent'
    : colors.primary;

  const borderColor = disabled ? '#ccc' : colors.primary;

  const textColor = disabled
    ? '#888'
    : isOutline
    ? colors.primary
    : '#FFFFFF';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          backgroundColor,
          borderColor,
          borderWidth: isOutline ? 2 : 0,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: textColor,
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

