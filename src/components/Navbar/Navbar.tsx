"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    },
    []
  );

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${menuOpen ? styles.menuIsOpen : ""}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo} onClick={(e) => handleNavClick(e, "#hero")}>
          <Image
            src="/F&S_Final Logo.svg"
            alt="Frames n Spaces"
            width={36}
            height={36}
            className={styles.logoIcon}
          />
          <div className={styles.logoText}>
            <span className={styles.logoName}></span>
            <span className={styles.logoTagline}></span>
          </div>
        </a>

        <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.link} ${activeSection === link.href.replace("#", "") ? styles.active : ""
                }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              <span className={styles.linkText}>{link.label}</span>
              <span className={styles.linkLine} />
            </a>
          ))}
          <button className={styles.ctaBtn} onClick={(e) => handleNavClick(e, "#contact")}>
            <span>Let&apos;s Connect</span>
          </button>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
