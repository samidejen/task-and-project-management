import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Logo from "../logo";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Overview",
    href: "#",
  },
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Careers",
    href: "#",
  },
  {
    title: "Help",
    href: "#",
  },
  {
    title: "Privacy",
    href: "#",
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="flex flex-col items-center justify-start py-12">
          {/* Logo */}
          <Logo src="/company.jpg" />

          <ul className="flex flex-wrap items-center gap-4 mt-6">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  to={href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between px-6 py-8 sm:flex-row gap-x-2 gap-y-5 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link to="/" target="_blank">
              AddisTech
            </Link>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link to="#" target="_blank">
              <TwitterIcon className="w-5 h-5" />
            </Link>
            <Link to="#" target="_blank">
              <DribbbleIcon className="w-5 h-5" />
            </Link>
            <Link to="#" target="_blank">
              <TwitchIcon className="w-5 h-5" />
            </Link>
            <Link to="#" target="_blank">
              <GithubIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
