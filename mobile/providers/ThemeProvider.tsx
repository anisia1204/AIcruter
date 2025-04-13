import { PropsWithChildren } from "react";
import { DefaultTheme, ThemeProvider as RNThemeProvider } from "@react-navigation/native";

DefaultTheme.colors.background = "white";
DefaultTheme.colors.primary = 'red';
DefaultTheme.colors.card = 'blue';
DefaultTheme.colors.text = 'gray';
DefaultTheme.colors.border = 'green';
DefaultTheme.colors.notification = 'purple';
// random colors
  
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <RNThemeProvider value={DefaultTheme}>
      {children}
    </RNThemeProvider>
  );
};
