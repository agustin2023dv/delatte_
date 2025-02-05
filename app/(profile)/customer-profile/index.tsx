import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Text} from 'react-native';
import ProfileTabs from './ProfileTabs';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';



export default function CustomerProfile() {
  const { isSigned } = useAuth(); 


  useEffect(() => {
    // Redirigir al usuario si no está autenticado
    if (!isSigned) {
      router.back();
      
    }
  }, [isSigned, router]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text onPress={() => router.back()}>Go Home</Text>
      <ProfileTabs />
    </SafeAreaView>
  );
}

