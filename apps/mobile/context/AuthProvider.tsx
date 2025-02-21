import { createContext, useContext, useState } from "react";
import { authClient } from "../lib/auth-client";
import type { User } from "better-auth/types";

interface AuthContextType {
  signOut: () => void;
  session: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>({
  signOut: async () => await authClient.signOut(),
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fetchSession = async () => {
    try {
      const session = await authClient.getSession();
      setSession(session.data);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
