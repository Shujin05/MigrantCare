import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Link, useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === 'background') {
      }
    });

    return () => appStateListener.remove();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      router.push('/(tabs)')
    } catch (error: any) {
      console.log(error); 
      alert("Sign in failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.innerContainer}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <ThemedText type='title' style={styles.title}>
            Welcome Back to MigrantMate!
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputField}>
          <Ionicons name="mail" size={28} color={Colors.light.tabIconDefault} />
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor={Colors.light.text}
            style={styles.input}
          />
          </View>
          <View style={styles.inputField}>
          <Ionicons name="lock-closed" size={28} color={Colors.light.tabIconDefault} />
          <TextInput
            onChangeText={setPassword}
            value={password}
            placeholder="password"
            placeholderTextColor={Colors.light.text}
            style={styles.input}
          />
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              style={styles.button}><ThemedText type="default" style={styles.buttonText}>Log In</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle" style={styles.registerText}>
              Don't have an account?{" "}
              <Link href="/register" style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>
                Register
              </Link>
            </ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 2, 
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 10, 
    padding: 10, 
    width: "100%", 
    marginLeft: 10, 
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    backgroundColor: Colors.light.tabIconDefault,
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: "white",
    fontWeight: 'bold',
  }, 
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  registerText: {
    fontSize: 16, 
  }, 
  inputField: {
    flexDirection: 'row', 
    width: '100%'
  }, 
});
