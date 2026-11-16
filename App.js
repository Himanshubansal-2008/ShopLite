import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import SkellXDemoModal from './src/components/SkellXDemoModal';

function Main() {
  const { themeMode } = useAppTheme();
  return (
    <>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
      <SkellXDemoModal />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
