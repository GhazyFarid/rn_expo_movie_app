// app/other-pages/_layout.tsx
import { Stack } from 'expo-router';

const _Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default _Layout;