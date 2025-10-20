import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify"; // Added toast import

type User = {
  id: string;
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>; // Add forgotPassword
  isLoading: boolean;
  supabase: typeof supabase; // Expose the supabase instance
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Supabase client with basic env validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isMissingSupabaseConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("placeholder") ||
  supabaseAnonKey.includes("placeholder");

const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("examify-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isMissingSupabaseConfig) {
        throw new Error(
          "Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
        );
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("No user returned from Supabase");
      }
      // You can fetch additional user info if needed
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email,
      };
      setUser(userObj);
      localStorage.setItem("examify-user", JSON.stringify(userObj));
      // Optionally store the session/token
      localStorage.setItem("examify-token", data.session?.access_token || "");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        // This might happen if email confirmation is required but user isn't instantly signed in
        // In this case, user will be null, and we need to guide the user to check email.
        toast.success(
          "Registration successful! Please check your email to confirm your account."
        );
        setUser(null); // Ensure user is null if not automatically signed in
        localStorage.removeItem("examify-user");
        localStorage.removeItem("examify-token");
        return; // Exit here as no user to set yet
      }

      // If user is immediately signed in (e.g., email confirmation not required, or already confirmed)
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email,
      };
      setUser(userObj);
      localStorage.setItem("examify-user", JSON.stringify(userObj));
      localStorage.setItem("examify-token", data.session?.access_token || "");

      toast.success("Registration successful and you are logged in!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut(); // Use Supabase signOut
    setUser(null);
    localStorage.removeItem("examify-user");
    localStorage.removeItem("examify-token"); // Clear local storage for token as well
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.message || "Failed to send reset email.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        forgotPassword,
        supabase,
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
