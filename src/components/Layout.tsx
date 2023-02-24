import { ReactNode } from "react";

import Nav from "./Nav";
import Footer from "./Footer";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
