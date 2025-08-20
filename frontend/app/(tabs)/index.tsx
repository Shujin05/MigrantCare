import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Modal, Pressable } from 'react-native';
import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import LabelButton from '@/components/LabelButton';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      auth.signOut(); 
      router.push("/login");
    } catch (error: any) {
      console.log(error); 
      alert("Sign out failed: " + error.message);
    }
  }

  return (
    <SafeAreaView style={styles.uiContainer}>
      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}> 
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.heading}>MigrantCare</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <LabelButton 
          label="Legal Chatbot" 
          onPress={() => router.push("/legal")} 
          color="#a3c4bc"
          imageSource={require('../../assets/images/legal_icon.png')}
          imageSize={52}
          style={styles.button}
        />
        <LabelButton 
          label="Loan Management" 
          onPress={() => router.push("/")} 
          color="#a3c4bc"
          imageSource={require('../../assets/images/financial_icon.png')}
          imageSize={52}
          style={styles.button}
        />
        <LabelButton 
          label="File Report" 
          onPress={() => router.push("/")} 
          color="#a3c4bc"
          imageSource={require('../../assets/images/document_icon.png')}
          imageSize={52}
          style={styles.button}
        />
        <LabelButton 
          label="Savings Planner" 
          onPress={() => router.push("/")} 
          color="#a3c4bc"
          imageSource={require('../../assets/images/savings_icon.png')}
          imageSize={52}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  uiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  heading:{
    marginBottom: 6,
  }, 
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 5,
  },
  button: {
    width: 120,
    height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute', 
    left: 20, 
    top: 20, 
  }
});
