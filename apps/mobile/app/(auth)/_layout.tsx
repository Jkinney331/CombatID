import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563EB',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="verify-identity"
        options={{ title: 'Verify Identity' }}
      />
      <Stack.Screen
        name="profile-setup"
        options={{ title: 'Profile Setup' }}
      />
    </Stack>
  );
}
