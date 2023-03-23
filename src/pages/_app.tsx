import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import type { AppProps } from "next/app";
import { auth } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "@/components/Layout";
import useUserStore from "@/stores/user";
import useToastStore from "@/stores/toast";
import ToastContainer from "@/components/ToastContainer";
import { getUserTier, createNewAccount } from "@/services/users";

export default function App({ Component, pageProps }: AppProps) {
  // Global states
  const { setUser, setEmail, setUserId, setTier } = useUserStore();
  const { addToast, toasts } = useToastStore();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
        // User logged in
        if (user) {
          setUser(user);
          setEmail(user.email ?? "");
          setUserId(user.uid);

          // POST request: Create new account if user is new
          await createNewAccount(user);

          // POST request: Retrieve user's tier
          const tier = await getUserTier(user);

          if (tier) {
            setTier(tier.tier);
          }
        } // User logged out
        else {
          // Set all states to default
          setUser(null);
          setEmail("");
          setUserId("");
          setTier("");
        }
      } catch (error) {
        // Add toast notification
        addToast({
          uniqueId: uuidv4(),
          className: "bg-red-50 text-red-700",
          content: "Something went wrong. Please try again! 😫",
        });
      }
    });
  }, []);

  return (
    <Layout>
      {/* Toast container */}
      {toasts.length > 0 && <ToastContainer />}

      <Component {...pageProps} />
    </Layout>
  );
}
