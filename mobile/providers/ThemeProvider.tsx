import { PropsWithChildren } from "react";
import { DefaultTheme, ThemeProvider as RNThemeProvider } from "@react-navigation/native";

export const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#eeeeee',       // soft light gray
    primary: '#3F51B5',          // indigo-500
    card: '#FFFFFF',             // white card background
    text: '#111827',             // gray-900
    border: '#E5E7EB',           // gray-200
    notification: '#EF4444',     // red-500
    lighter: '#6C63FF'           // lighter indigo
  },
};
  
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <RNThemeProvider value={CustomTheme}>
      {children}
    </RNThemeProvider>
  );
};
