"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSiteData, type Testimonial } from "@/data/siteData";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const headerRef = useScrollReveal();
  const contentRef = useScrollReveal(0.1);

  useEffect(() => {
    getSiteData().then(data => setTestimonials(data.testimonials));
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[active];

  return (
    <section className={`section ${styles.testimonials}`}>
      <div className="container">
        <div className={styles.header} ref={headerRef}>
          <span className="label">[ 09 ] — Client Stories</span>
          <h2 className={`heading-lg ${styles.heading}`}>
            Words of <span className={styles.accent}>Trust</span>
          </h2>
        </div>

        {current && (
          <div className={styles.content} ref={contentRef}>
            <div className={styles.quoteIcon}>&ldquo;</div>
            <blockquote className={styles.quote} key={current.id}>
              {current.text}
            </blockquote>
            <div className={styles.stars}>
              {Array.from({ length: current.rating }).map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <div className={styles.author}>
              <div className={styles.authorAvatar}>
                {current.name.charAt(0)}
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{current.name}</span>
                <span className={styles.authorLocation}>{current.location}</span>
              </div>
            </div>

            {/* Navigation dots */}
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
