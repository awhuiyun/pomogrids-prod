import { ReactNode } from "react";

import Nav from "./Nav";
import Footer from "./Footer";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
