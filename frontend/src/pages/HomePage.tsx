import Hero from "../components/landing/hero";
import Cta from "../components/landing/cta";
import RootLayout from "@/layouts/RootLayout";

export default function HomePage() {
  return (
    <RootLayout>
      <main className="pt-16">
        <Hero />
        <Cta
          heading="Stay on Top of Every Project"
          description="Organize tasks, track progress, and collaborate with your team — all in one unified dashboard designed for efficient project delivery."
        />
      </main>
    </RootLayout>
  );
}
