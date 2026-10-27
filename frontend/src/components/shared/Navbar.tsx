"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { LeafIcon, MenuIcon, XIcon } from "./icons";
import Container from "./Container";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plants", label: "Plants" },
    { href: "#upload", label: "Upload" },
    { href: "#features", label: "Features" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-primary-100">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary-800 font-bold text-xl">
            <LeafIcon className="w-7 h-7 text-primary-600" />
            <span>DeepLeaf</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="#upload">
              <Button size="sm">Upload Photo</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-primary-100 mt-2 pt-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-text-secondary hover:text-primary-700 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="#upload" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Upload Photo</Button>
            </Link>
          </div>
        )}
      </Container>
    </nav>
  );
}
