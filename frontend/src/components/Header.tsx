import { useId } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const id = useId();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b px-2 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo - Using IconTextLogo */}
        <Logo src="/public/company.jpg" />

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button asChild size="sm" className="text-sm">
            <Link to="/signup">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
