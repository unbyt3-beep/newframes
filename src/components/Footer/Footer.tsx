"use client";

import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Image
                src="/F&S_Final Logo.svg"
                alt="Frames n Spaces"
                width={32}
                height={32}
                className={styles.logoImg}
              />
              <div>
                <span className={styles.logoName}></span>
                <span className={styles.logoTag}>Precision in every corner</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Premium consultancy and advisory for transformative workspace
              solutions. Empowering architects and corporates across India with
              precision-driven expertise.
            </p>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksTitle}>Quick Links</h4>
            <a href="#hero" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#hero")}>Home</a>
            <a href="#about" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#about")}>About</a>
            <a href="#services" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#services")}>Services</a>
            <a href="#portfolio" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#portfolio")}>Portfolio</a>
            <a href="#blog" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#blog")}>Blog</a>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksTitle}>Services</h4>
            <a href="#services" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#services")}>Strategic Advisory</a>
            <a href="#services" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#services")}>Design Consultancy</a>
            <a href="#services" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#services")}>PMC Services</a>
            <a href="#services" className={styles.footerLink} onClick={(e) => handleNavClick(e, "#services")}>Technical Advisory</a>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksTitle}>Contact</h4>
            <span className={styles.contactItem}>
              109, Lumbini Avenue, Gachibowli, Hyderabad
            </span>
            <a href="mailto:info@framesnspaces.com" className={styles.footerLink}>
              info@framesnspaces.com
            </a>
            <a href="tel:+918919296590" className={styles.footerLink}>
              +91-89192 96590
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Frames n Spaces. All rights reserved.
          </span>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
