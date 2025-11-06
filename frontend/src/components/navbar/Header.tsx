import { useId } from "react";
import { Link } from "react-router-dom";
import Logo from "../logo";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const id = useId();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 border-b bg-background md:px-6">
      <div className="flex items-center justify-between h-16 gap-4">
        {/* Logo - Using IconTextLogo */}
        <Logo src="/public/company.jpg" />

        {/* Right side */}
        <div className="flex items-center justify-end flex-1 gap-3">
          <Button asChild size="sm" className="text-sm">
            <Link to="/login">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
