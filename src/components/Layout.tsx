import { ReactNode } from "react";

import Nav from "./Nav";
import Footer from "./Footer";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-2 flex flex-col min-h-screen text-slate-900">
      <Nav />
      <div className="flex-grow pt-4">{children}</div>
      <Footer />
    </div>
  );
}
