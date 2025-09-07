import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (firebaseUser) => {
      if(firebaseUser){
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        })
      }
      setLoading(false);
      unsubscribe()
    })
  }, []);

  const login = async (username, password) => {
    // Demo credentials

    await signInWithEmailAndPassword(auth,username,password).then(user=>{
      setUser({
        name: user.user.displayName,
        email: user.user.email,
        uid: user.user.uid,
      })
      return true;
    }).catch(err=>{
      return false;
    }
    )
  };

  const register =async (userData) => {
    try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

    await auth.signOut();

    // trigger switch only once after registration
    if (userData.onSwitchToLogin) {
      userData.onSwitchToLogin();
    }

    return true; // ✅ success
  } catch (err) {
    return err; // ❌ failure
  }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null)
  };

  const value = {
    user,
    login,
    setLoading,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}