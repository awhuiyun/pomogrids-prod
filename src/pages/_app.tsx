import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { auth } from "@/auth/functions";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "@/components/Layout";
import useUserStore from "@/stores/user";

export default function App({ Component, pageProps }: AppProps) {
  const { setUser, setEmail, setUserId, user } = useUserStore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email ?? "");
        setUserId(user.uid);
      } else {
        setUser(null);
      }
    });
  }, []);

  console.log(user);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
