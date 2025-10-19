import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // your existing config
import { EXPO_PUBLIC_GOOGLE_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID, // required for Firebase
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(userCred => {
          console.log('✅ Google Sign-In success:', userCred.user.email);
        })
        .catch(err => {
          console.error('❌ Firebase Google Sign-In error:', err);
        });
    }
  }, [response]);

  return { request, promptAsync };
};
