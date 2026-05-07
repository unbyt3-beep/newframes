"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getSiteData, type AboutData } from "@/data/siteData";
import styles from "./About.module.css";
import Image from "next/image";
import { fixImageUrl } from "@/utils/imageUtils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const mainRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(data => setAbout(data.about));
  }, []);

  const { visionPoints, missionPoints, displayHeading, displayDesc1 } = useMemo(() => {
    if (!about) return { visionPoints: [], missionPoints: [], displayHeading: "", displayDesc1: "" };

    const fullDesc = about.description2;
    let visionPart = "";
    let missionPart = "";

    if (fullDesc.includes("|")) {
      const parts = fullDesc.split("|");
      visionPart = parts[0];
      missionPart = parts[1];
    } else {
      visionPart = fullDesc;
    }
    
    let cleanVision = visionPart.replace(/OUR VISION:/i, "").trim();
    let cleanMission = missionPart.replace(/OUR MISSION:/i, "").trim();

    if (!fullDesc.includes("|") || cleanVision.length < 50 || !cleanVision.includes("governance")) {
      cleanVision = "To become India’s most trusted Project Management Consultancy, delivering structured governance, intelligent design integration, and seamless turnkey execution across diverse sectors. To redefine project delivery standards in India by integrating design intelligence, project management expertise, and turnkey execution into a seamless, value-driven experience.";
    }
    if (!fullDesc.includes("|") || cleanMission.length < 50 || !cleanMission.includes("RESPONSIVE")) {
      cleanMission = "At Frames n Spaces, we are dedicated to being the industry's MOST RESPONSIVE ORGANISATION. We deliver exceptional QUALITY in project management consultancy (PMC), and design-build services, while fostering an environment that enhances employee skills and professional growth. Ensuring exceptional products and services providing COMMITMENT TO DELIVERY";
    }

    const vPoints = cleanVision
      .split(/(?=To )/)
      .filter(p => p.trim().length > 0)
      .map(p => p.trim());

    const mPoints = cleanMission
      .split(/(?=At |We |Ensuring )/)
      .filter(p => p.trim().length > 0)
      .map(p => p.trim());

    const heading = about.heading.toUpperCase().includes("PREMIUM") 
      ? about.heading.toUpperCase().replace("PREMIUM", "PROJECT")
      : about.heading;
      
    const desc1 = about.description1.replace(/premium/gi, "project management");

    return { visionPoints: vPoints, missionPoints: mPoints, displayHeading: heading, displayDesc1: desc1 };
  }, [about]);

  useEffect(() => {
    if (!mounted || !about || !mainRef.current) return;

    const ctx = gsap.context((self) => {
      if (!self || !self.selector) return;
      
      const left = self.selector(".animate-left");
      const right = self.selector(".animate-right");
      const visionCards = self.selector(".vision-card");
      const missionCards = self.selector(".mission-card");

      if (left.length > 0) {
        gsap.fromTo(left, 
          { opacity: 0, x: -50 }, 
          { 
            opacity: 1, 
            x: 0, 
            duration: 1, 
            ease: "power3.out", 
            scrollTrigger: { 
              trigger: left, 
              start: "top 85%",
              toggleActions: "play none none none"
            } 
          }
        );
      }
      
      if (right.length > 0) {
        gsap.fromTo(right, 
          { opacity: 0, x: 50 }, 
          { 
            opacity: 1, 
            x: 0, 
            duration: 1, 
            ease: "power3.out", 
            scrollTrigger: { 
              trigger: right, 
              start: "top 85%",
              toggleActions: "play none none none"
            } 
          }
        );
      }

      if (visionCards.length > 0) {
        gsap.fromTo(visionCards,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out", 
            scrollTrigger: { 
              trigger: visionRef.current, 
              start: "top 85%",
              toggleActions: "play none none none"
            } 
          }
        );
      }

      if (missionCards.length > 0) {
        gsap.fromTo(missionCards,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out", 
            scrollTrigger: { 
              trigger: missionRef.current, 
              start: "top 85%",
              toggleActions: "play none none none"
            } 
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, [mounted, about]);

  if (!mounted || !about) return null;

  return (
    <section id="about" className={`section ${styles.about}`} ref={mainRef}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.left} animate-left`}>
            <span className="label">[ 01 ] — Who We Are</span>
            <h2 className={`heading-lg ${styles.heading}`}>
              {displayHeading}
            </h2>
            <p className="body-lg">{displayDesc1}</p>
          </div>

          <div className={`${styles.right} animate-right`}>
            <div className={styles.imageWrap}>
              <Image
                src={fixImageUrl(about.imageUrl)}
                alt="About Frames n Spaces"
                width={600}
                height={500}
                className={styles.image}
                priority
              />
              <div className={styles.imageBorder} />
            </div>
          </div>
        </div>

        <div className={styles.strategySection}>
          <div className={styles.strategyBlock}>
            <h3 className={styles.strategyTitle}>OUR MISSION</h3>
            <div className={styles.missionGrid} ref={missionRef}>
              {missionPoints.map((point, index) => (
                <div key={`mission-${index}`} className={`${styles.missionCard} mission-card`}>
                  <div className={styles.missionIcon}>◈</div>
                  <p className={styles.missionText}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.strategyBlock}>
            <h3 className={styles.strategyTitle}>OUR VISION</h3>
            <div className={styles.visionGrid} ref={visionRef}>
              {visionPoints.map((point, index) => (
                <div key={`vision-${index}`} className={`${styles.visionCard} vision-card`}>
                  <div className={styles.visionIcon}>✦</div>
                  <p className={styles.visionText}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
