import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";
import ThemeToggle from "../ThemeToggle.jsx";
import { IconArrowRight } from "../Icons.jsx";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Analysis" },
  { href: "#guide", label: "Face shapes" },
  { href: "#gallery", label: "Frames" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-surface/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-editorial items-center justify-between px-6 py-4">
        <Link to="/" aria-label="FrameFit home"><Logo size={19} /></Link>
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-fg/80 transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/try" className="btn-accent !px-5 !py-2.5 text-[13px]">
            Analyze my face <IconArrowRight size={15} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
