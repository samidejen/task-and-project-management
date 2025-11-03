import React from "react";
import type { ReactNode } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default RootLayout;
