"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSiteData, type Service } from "@/data/siteData";
import styles from "./Services.module.css";
import { fixImageUrl } from "@/utils/imageUtils";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const headerRef = useScrollReveal();
  const cardsRef = useScrollReveal(0.1);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(data => setServices(data.services));
  }, []);

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;

  return (
    <section id="services" className={`section ${styles.services}`}>
      <div className="container">
        <div className={styles.header} ref={headerRef}>
          <span className="label">[ 03 ] — Our Services</span>
          <h2 className={`heading-lg ${styles.heading}`}>
            What We <span className={styles.accent}>Offer</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: "600px" }}>
            From space planning to technical advisory,
            we provide end-to-end consultancy and advisory services for modern work environments.
          </p>
        </div>

        <div className={styles.display} ref={cardsRef}>
          <div className={styles.serviceList}>
            {services.map((svc, i) => (
              <button
                key={svc.id}
                className={`${styles.serviceItem} ${i === activeIdx ? styles.serviceItemActive : ""}`}
                onClick={() => setActiveIdx(i)}
              >
                <span className={styles.serviceIcon}>{svc.icon}</span>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceTitle}>{svc.title}</h3>
                  <span className={styles.serviceSub}>{svc.subtitle}</span>
                </div>
                <span className={styles.serviceArrow}>→</span>
                <div className={styles.serviceProgress} />
              </button>
            ))}
          </div>

          {services[activeIdx] && (
            <div className={styles.serviceDetail} key={services[activeIdx].id}>
              {/* Service image */}
              <div className={styles.detailImageWrap}>
                <Image
                  src={fixImageUrl(services[activeIdx].imageUrl)}
                  alt={services[activeIdx].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.detailImage}
                />
                <div className={styles.detailImageOverlay} />
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailBadge}>
                  <span className={styles.detailIcon}>{services[activeIdx].icon}</span>
                </div>
                <h3 className={styles.detailTitle}>{services[activeIdx].title}</h3>
                <p className={styles.detailDesc}>{services[activeIdx].description}</p>
                <ul className={styles.featureList}>
                  {services[activeIdx].features.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary" onClick={handleContact}>
                  <span>Inquire Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
