import { createContext, useContext } from "react";
import { authClient } from "../lib/auth-client";
import type { Session } from "../lib/auth-client";
interface AuthContextType {
  isPending: boolean;
  session: Session | null;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>({
  isPending: true,
  session: null,
  signOut: async () => await authClient.signOut(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isPending,
        session,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
