"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getSiteData, type AboutData } from "@/data/siteData";
import styles from "./About.module.css";
import Image from "next/image";

export default function About() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(data => setAbout(data.about));
  }, []);

  useEffect(() => {
    if (!about) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref1.current, 
        { opacity: 0, x: -50 }, 
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref1.current, start: "top 80%" } }
      );
      
      gsap.fromTo(ref2.current, 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref2.current, start: "top 80%" } }
      );

      if (visionRef.current) {
        gsap.fromTo(Array.from(visionRef.current.children),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: visionRef.current, start: "top 80%" } }
        );
      }

      if (missionRef.current) {
        gsap.fromTo(Array.from(missionRef.current.children),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: missionRef.current, start: "top 80%" } }
        );
      }
    });

    return () => ctx.revert();
  }, [about]);

  if (!mounted || !about) return null;

  // Split description2 into Vision and Mission
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
  
  // Clean headers
  let cleanVision = visionPart.replace(/OUR VISION:/i, "").trim();
  let cleanMission = missionPart.replace(/OUR MISSION:/i, "").trim();

  // Force the new strategic content if the old format is detected (stale localStorage)
  if (!fullDesc.includes("|") || cleanVision.length < 50 || !cleanVision.includes("governance")) {
    cleanVision = "To become India’s most trusted Project Management Consultancy, delivering structured governance, intelligent design integration, and seamless turnkey execution across diverse sectors. To redefine project delivery standards in India by integrating design intelligence, project management expertise, and turnkey execution into a seamless, value-driven experience.";
  }
  if (!fullDesc.includes("|") || cleanMission.length < 50 || !cleanMission.includes("RESPONSIVE")) {
    cleanMission = "At Frames n Spaces, we are dedicated to being the industry's MOST RESPONSIVE ORGANISATION. We deliver exceptional QUALITY in project management consultancy (PMC), and design-build services, while fostering an environment that enhances employee skills and professional growth. Ensuring exceptional products and services providing COMMITMENT TO DELIVERY";
  }

  const visionPoints = cleanVision
    .split(/(?=To )/)
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  const missionPoints = cleanMission
    .split(/(?=At |We |Ensuring )/)
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  // Sanitize data to remove 'premium' if it exists (for stale localStorage)
  const displayHeading = about.heading.toUpperCase().includes("PREMIUM") 
    ? about.heading.toUpperCase().replace("PREMIUM", "PROJECT")
    : about.heading;
    
  const displayDesc1 = about.description1.replace(/premium/gi, "project management");

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left} ref={ref1}>
            <span className="label">[ 01 ] — Who We Are</span>
            <h2 className={`heading-lg ${styles.heading}`}>
              {displayHeading}
            </h2>
            <p className="body-lg">{displayDesc1}</p>
          </div>

          <div className={styles.right} ref={ref2}>
            <div className={styles.imageWrap}>
              <Image
                src={about.imageUrl}
                alt="About Frames n Spaces"
                width={600}
                height={500}
                className={styles.image}
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
                <div key={`mission-${index}`} className={styles.missionCard}>
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
                <div key={`vision-${index}`} className={styles.visionCard}>
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
