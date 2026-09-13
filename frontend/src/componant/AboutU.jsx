import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const stats = [
  { num: "50K+", label: "Happy Plant Parents" },
  { num: "500+", label: "Plants & Products" },
  { num: "98%", label: "Customer Satisfaction" },
  { num: "4.8★", label: "Average Rating" },
];

const values = [
  {
    icon: "01",
    title: "Healthy Plants",
    desc: "We carefully select healthy, fresh plants so they arrive at your home ready to grow.",
  },
  {
    icon: "02",
    title: "Easy Plant Care",
    desc: "From beginner-friendly plants to expert care essentials, we make plant parenting simple.",
  },
  {
    icon: "03",
    title: "Honest Pricing",
    desc: "Quality plants and gardening essentials at fair and transparent prices.",
  },
  {
    icon: "04",
    title: "Growing Together",
    desc: "Our community of plant lovers inspires us to make every home a little greener.",
  },
];

const categories = [
  "Indoor Plants",
  "Outdoor Plants",
  "Flowering Plants",
  "Succulents",
  "Air Purifying Plants",
  "Pots & Planters",
  "Plant Care",
];

const team = [
  {
    initials: "PH",
    name: "Plant House",
    role: "Plant Care Team",
    bio: "A passionate team of plant lovers helping homes across India grow greener.",
  },
  {
    initials: "YC",
    name: "Yash Chauhan",
    role: "Head of Operations",
    bio: "Making sure every plant is carefully packed and reaches its new home safely.",
  },
  {
    initials: "RM",
    name: "Rohan Mehta",
    role: "Tech & Product Lead",
    bio: "Building a simple and beautiful online experience for every plant lover.",
  },
];

/* Counter animation */
function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState("0");
  const raf = useRef(null);

  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const suffix = target.replace(/[0-9.]/g, "");

    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min(
        (timestamp - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      const value =
        num % 1 !== 0
          ? (num * eased).toFixed(1)
          : Math.floor(num * eased);

      setCount(`${value}${suffix}`);

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return count;
}

function StatCard({ num, label }) {
  const value = useCountUp(num);

  return (
    <div className="about-stat-card">
      <span className="about-stat-number">{value}</span>
      <span className="about-stat-label">{label}</span>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div
      className="plant-house-about"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        .plant-house-about {
          min-height: 100vh;
          background: #f4fbf6;
          color: #12351f;
          overflow: hidden;
        }

        .plant-house-about .playfair {
          font-family: 'Playfair Display', serif;
        }

        /* =========================
           ANIMATIONS
        ========================= */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        @keyframes floatingLeaf {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(4deg);
          }
        }

        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both;
        }

        .shimmer-text {
          background:
            linear-gradient(
              90deg,
              #03541e,
              #65c879,
              #b6efc2,
              #03541e
            );

          background-size: 250% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          background-clip: text;

          animation: shimmer 5s linear infinite;
        }

        /* =========================
           DECORATIVE BACKGROUND
        ========================= */

        .about-glow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(70px);
        }

        .about-glow-one {
          width: 420px;
          height: 420px;
          background: rgba(78, 180, 103, 0.11);
          top: -180px;
          left: 5%;
        }

        .about-glow-two {
          width: 320px;
          height: 320px;
          background: rgba(166, 214, 176, 0.14);
          right: 5%;
          bottom: -100px;
        }

        /* =========================
           HERO
        ========================= */

        .about-hero {
          position: relative;
          padding: 95px 24px 80px;
          overflow: hidden;
        }

        .about-hero-container {
          position: relative;
          z-index: 2;
          max-width: 1050px;
          margin: 0 auto;
          text-align: center;
        }

        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 17px;
          border-radius: 999px;
          background: rgba(3, 84, 30, 0.07);
          border: 1px solid rgba(3, 84, 30, 0.18);
          color: #03541e;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .about-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #65c879;
          box-shadow: 0 0 0 5px rgba(101, 200, 121, 0.12);
        }

        .about-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 82px);
          line-height: 1.04;
          font-weight: 900;
          margin: 0 0 25px;
          color: #12351f;
        }

        .about-hero-description {
          max-width: 720px;
          margin: 0 auto 35px;
          color: #55705f;
          font-size: 17px;
          line-height: 1.8;
        }

        .about-hero-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .about-btn-primary,
        .about-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 25px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .about-btn-primary {
          color: #fff;
          background: #03541e;
          box-shadow: 0 10px 25px rgba(3, 84, 30, 0.18);
        }

        .about-btn-primary:hover {
          background: #12351f;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(3, 84, 30, 0.25);
        }

        .about-btn-outline {
          color: #12351f;
          background: #fff;
          border: 1px solid #bcd6c2;
        }

        .about-btn-outline:hover {
          border-color: #03541e;
          color: #03541e;
          transform: translateY(-2px);
        }

        /* =========================
           DIVIDER
        ========================= */

        .about-divider {
          width: min(1150px, calc(100% - 48px));
          height: 1px;
          margin: 0 auto;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(3, 84, 30, 0.25),
              transparent
            );
        }

        /* =========================
           STATS
        ========================= */

        .about-stats-section {
          padding: 55px 24px;
        }

        .about-stats-grid {
          max-width: 1050px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .about-stat-card {
          background: #fff;
          border: 1px solid #d7eadb;
          border-radius: 18px;
          padding: 27px 15px;
          text-align: center;
          transition: all 0.25s ease;
        }

        .about-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 35px rgba(3, 84, 30, 0.08);
          border-color: rgba(3, 84, 30, 0.25);
        }

        .about-stat-number {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 900;
          color: #03541e;
          margin-bottom: 5px;
        }

        .about-stat-label {
          display: block;
          color: #55705f;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }

        /* =========================
           COMMON SECTION
        ========================= */

        .about-section {
          padding: 90px 24px;
        }

        .about-container {
          max-width: 1150px;
          margin: 0 auto;
        }

        /* =========================
           WHO WE ARE
        ========================= */

        .about-who-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
        }

        .about-visual {
          position: relative;
        }

        .about-visual-main {
          position: relative;
          min-height: 450px;
          overflow: hidden;
          border-radius: 30px;
          background:
            linear-gradient(
              145deg,
              #dff4e4,
              #edf8ef
            );
          border: 1px solid #cfe4d3;
        }

        .about-plant-circle {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(3,84,30,0.16),
              rgba(3,84,30,0.02)
            );
          left: 50%;
          top: 43%;
          transform: translate(-50%, -50%);
        }

        .about-visual-letter {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          font-family: 'Playfair Display', serif;
          font-size: 210px;
          font-weight: 900;
          line-height: 1;
          color: rgba(3, 84, 30, 0.10);
        }

        .about-leaf {
          position: absolute;
          width: 90px;
          height: 145px;
          border-radius: 100% 0 100% 0;
          background: linear-gradient(
            145deg,
            #58bd6d,
            #03541e
          );
          opacity: 0.82;
          animation: floatingLeaf 4s ease-in-out infinite;
        }

        .about-leaf-one {
          left: 30%;
          top: 18%;
          transform: rotate(-28deg);
        }

        .about-leaf-two {
          right: 25%;
          top: 27%;
          transform: rotate(35deg);
          animation-delay: 0.8s;
        }

        .about-leaf-three {
          left: 38%;
          bottom: 26%;
          transform: rotate(-45deg);
          animation-delay: 1.4s;
        }

        .about-mission {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(3,84,30,0.14);
          border-radius: 17px;
        }

        .about-small-label {
          display: block;
          color: #55705f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.7px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .about-mission-text {
          margin: 0;
          color: #12351f;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 600;
        }

        .about-section-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #03541e;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .about-section-label::before {
          content: "";
          width: 25px;
          height: 2px;
          background: #65c879;
          border-radius: 10px;
        }

        .about-heading {
          font-family: 'Playfair Display', serif;
          color: #12351f;
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.12;
          font-weight: 900;
          margin: 0 0 22px;
        }

        .about-green {
          color: #03541e;
        }

        .about-text {
          color: #55705f;
          font-size: 15px;
          line-height: 1.85;
          margin: 0 0 17px;
        }

        .about-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 28px;
        }

        .about-fact {
          padding-right: 25px;
          margin-right: 25px;
          border-right: 1px solid rgba(3,84,30,0.2);
        }

        .about-fact:last-child {
          border-right: none;
          margin-right: 0;
        }

        .about-fact-value {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 23px;
          font-weight: 900;
          color: #03541e;
        }

        .about-fact-label {
          display: block;
          color: #55705f;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 3px;
        }

        /* =========================
           VALUES
        ========================= */

        .about-centered-heading {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 45px;
        }

        .about-centered-heading .about-section-label {
          justify-content: center;
        }

        .about-centered-heading .about-section-label::before {
          display: none;
        }

        .about-subtext {
          color: #55705f;
          font-size: 14px;
          line-height: 1.7;
          max-width: 570px;
          margin: 12px auto 0;
        }

        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .about-value-card {
          position: relative;
          overflow: hidden;
          padding: 27px;
          min-height: 245px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid #d7eadb;
          transition: all 0.25s ease;
        }

        .about-value-card:hover {
          transform: translateY(-6px);
          border-color: rgba(3,84,30,0.3);
          box-shadow: 0 20px 40px rgba(3,84,30,0.09);
        }

        .about-value-number {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eaf7ed;
          border: 1px solid #cce5d1;
          color: #03541e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 22px;
        }

        .about-value-title {
          margin: 0 0 10px;
          color: #12351f;
          font-size: 16px;
          font-weight: 800;
        }

        .about-value-desc {
          margin: 0;
          color: #55705f;
          font-size: 13px;
          line-height: 1.75;
        }

        .about-value-decoration {
          position: absolute;
          right: -25px;
          bottom: -25px;
          width: 85px;
          height: 85px;
          border-radius: 50%;
          border: 1px solid rgba(3,84,30,0.08);
          background: rgba(3,84,30,0.025);
        }

        /* =========================
           CATEGORIES
        ========================= */

        .about-category-section {
          background: #ecf7ef;
        }

        .about-category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .about-category {
          padding: 17px 18px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid #d4e8d8;
          color: #03541e;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          transition: all 0.2s ease;
        }

        .about-category:hover {
          background: #03541e;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(3,84,30,0.16);
        }

        /* =========================
           JOURNEY
        ========================= */

        .about-timeline {
          max-width: 820px;
          margin: 0 auto;
          border-left: 2px solid rgba(3,84,30,0.15);
          padding-left: 30px;
        }

        .about-timeline-item {
          position: relative;
          padding-bottom: 27px;
        }

        .about-timeline-item:last-child {
          padding-bottom: 0;
        }

        .about-timeline-dot {
          position: absolute;
          left: -44px;
          top: 2px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #03541e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-timeline-dot-inner {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #65c879;
        }

        .about-timeline-card {
          padding: 20px 22px;
          border-radius: 17px;
          background: #fff;
          border: 1px solid #d7eadb;
          transition: all 0.25s ease;
        }

        .about-timeline-card:hover {
          transform: translateX(5px);
          box-shadow: 0 15px 30px rgba(3,84,30,0.07);
        }

        .about-year {
          color: #03541e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .about-timeline-title {
          margin: 5px 0 5px;
          color: #12351f;
          font-size: 16px;
          font-weight: 800;
        }

        .about-timeline-desc {
          margin: 0;
          color: #55705f;
          font-size: 13px;
          line-height: 1.7;
        }

        /* =========================
           TEAM
        ========================= */

        .about-team-grid {
          max-width: 900px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .about-team-card {
          padding: 27px 20px;
          text-align: center;
          background: #fff;
          border: 1px solid #d7eadb;
          border-radius: 20px;
          transition: all 0.25s ease;
        }

        .about-team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(3,84,30,0.08);
        }

        .about-avatar {
          width: 82px;
          height: 82px;
          margin: 0 auto 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              145deg,
              #dff4e4,
              #bce8c5
            );
          border: 2px solid #9fd7aa;
        }

        .about-avatar span {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 900;
          color: #03541e;
        }

        .about-team-name {
          margin: 0;
          color: #12351f;
          font-weight: 800;
          font-size: 15px;
        }

        .about-team-role {
          margin-top: 4px;
          color: #03541e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .about-team-bio {
          margin: 13px 0 0;
          color: #55705f;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================
           CTA
        ========================= */

        .about-cta-section {
          padding: 70px 24px 90px;
        }

        .about-cta {
          position: relative;
          overflow: hidden;
          max-width: 1050px;
          margin: auto;
          padding: 65px 30px;
          border-radius: 28px;
          background:
            linear-gradient(
              135deg,
              #03541e,
              #12351f
            );
          text-align: center;
        }

        .about-cta-circle-one,
        .about-cta-circle-two {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .about-cta-circle-one {
          width: 250px;
          height: 250px;
          top: -130px;
          left: -90px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .about-cta-circle-two {
          width: 300px;
          height: 300px;
          right: -140px;
          bottom: -180px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .about-cta-content {
          position: relative;
          z-index: 2;
        }

        .about-cta-label {
          color: #9de8aa;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .about-cta-title {
          max-width: 650px;
          margin: auto;
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.1;
          font-weight: 900;
        }

        .about-cta-text {
          max-width: 560px;
          margin: 15px auto 27px;
          color: #d7eadb;
          font-size: 14px;
          line-height: 1.8;
        }

        .about-cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 28px;
          border-radius: 12px;
          background: #fff;
          color: #03541e;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          transition: all 0.25s ease;
        }

        .about-cta-button:hover {
          background: #dff4e4;
          transform: translateY(-2px);
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {

          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-who-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .about-values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-team-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .about-section {
            padding: 70px 22px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .about-hero {
            padding: 60px 18px 55px;
          }

          .about-hero-title {
            font-size: 42px;
          }

          .about-hero-description {
            font-size: 14px;
            line-height: 1.75;
          }

          .about-hero-buttons {
            width: 100%;
          }

          .about-btn-primary,
          .about-btn-outline {
            width: 100%;
          }

          .about-stats-section {
            padding: 40px 16px;
          }

          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .about-stat-card {
            padding: 21px 8px;
            border-radius: 14px;
          }

          .about-stat-number {
            font-size: 27px;
          }

          .about-stat-label {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .about-section {
            padding: 60px 17px;
          }

          .about-who-grid {
            gap: 35px;
          }

          .about-visual-main {
            min-height: 360px;
            border-radius: 22px;
          }

          .about-plant-circle {
            width: 230px;
            height: 230px;
          }

          .about-visual-letter {
            font-size: 150px;
          }

          .about-leaf {
            width: 65px;
            height: 105px;
          }

          .about-mission {
            left: 14px;
            right: 14px;
            bottom: 14px;
            padding: 14px;
          }

          .about-heading {
            font-size: 35px;
          }

          .about-text {
            font-size: 14px;
          }

          .about-facts {
            gap: 18px 0;
          }

          .about-fact {
            padding-right: 15px;
            margin-right: 15px;
          }

          .about-fact-value {
            font-size: 19px;
          }

          .about-fact-label {
            font-size: 8px;
          }

          .about-values-grid {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .about-value-card {
            min-height: auto;
            padding: 22px;
          }

          .about-centered-heading {
            margin-bottom: 30px;
          }

          .about-category-grid {
            grid-template-columns: 1fr;
          }

          .about-category {
            padding: 15px;
          }

          .about-timeline {
            padding-left: 23px;
          }

          .about-timeline-dot {
            left: -36px;
            width: 21px;
            height: 21px;
          }

          .about-timeline-dot-inner {
            width: 6px;
            height: 6px;
          }

          .about-timeline-card {
            padding: 17px;
          }

          .about-team-grid {
            grid-template-columns: 1fr;
            max-width: 340px;
          }

          .about-cta-section {
            padding: 40px 16px 60px;
          }

          .about-cta {
            padding: 45px 20px;
            border-radius: 22px;
          }

          .about-cta-title {
            font-size: 34px;
          }

          .about-cta-text {
            font-size: 13px;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar />

      {/* =========================
          HERO
      ========================= */}

      <section className="about-hero">
        <div className="about-glow about-glow-one" />
        <div className="about-glow about-glow-two" />

        <div className="about-hero-container">

          <div
            className="about-badge fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="about-dot" />
            Our Story
          </div>

          <h1
            className="about-hero-title fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Bringing More
            <br />
            <span className="shimmer-text">
              Life Into Your Home.
            </span>
          </h1>

          <p
            className="about-hero-description fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Plant House was created with one simple idea —
            make it easy for everyone to bring beautiful,
            healthy plants into their everyday spaces.
            From indoor greens to flowering beauties and
            thoughtful plant-care essentials, we are here
            to help your home grow greener.
          </p>

          <div
            className="about-hero-buttons fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/products"
              className="about-btn-primary"
            >
              Explore Plants
            </Link>

            <Link
              to="/contact-us"
              className="about-btn-outline"
            >
              Get in Touch
            </Link>
          </div>

        </div>
      </section>

      <div className="about-divider" />

      {/* =========================
          STATS
      ========================= */}

      <section className="about-stats-section">
        <div className="about-stats-grid">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              num={stat.num}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      <div className="about-divider" />

      {/* =========================
          WHO WE ARE
      ========================= */}

      <section className="about-section">
        <div className="about-container">

          <div className="about-who-grid">

            <div className="about-visual">

              <div className="about-visual-main">

                <div className="about-plant-circle" />

                <div className="about-leaf about-leaf-one" />
                <div className="about-leaf about-leaf-two" />
                <div className="about-leaf about-leaf-three" />

                <span className="about-visual-letter">
                  P
                </span>

                <div className="about-mission">

                  <span className="about-small-label">
                    Our Mission
                  </span>

                  <p className="about-mission-text">
                    To help every home become a happier,
                    healthier and greener space.
                  </p>

                </div>

              </div>

            </div>

            <div>

              <div className="about-section-label">
                Who We Are
              </div>

              <h2 className="about-heading">
                A little more
                <br />
                <span className="about-green">
                  green in every home.
                </span>
              </h2>

              <p className="about-text">
                Plant House started with a simple passion:
                helping people experience the joy of growing
                plants at home.
              </p>

              <p className="about-text">
                We believe plants should not feel complicated.
                Whether you are buying your first indoor plant,
                creating a balcony garden or looking for the
                right plant-care essentials, our goal is to make
                every step simple and enjoyable.
              </p>

              <p className="about-text">
                Our collection brings together beautiful plants,
                practical planters and reliable care products
                so you can create a space that feels fresh,
                peaceful and alive.
              </p>

              <div className="about-facts">

                <div className="about-fact">
                  <span className="about-fact-value">
                    2021
                  </span>
                  <span className="about-fact-label">
                    Founded
                  </span>
                </div>

                <div className="about-fact">
                  <span className="about-fact-value">
                    India
                  </span>
                  <span className="about-fact-label">
                    Serving Across
                  </span>
                </div>

                <div className="about-fact">
                  <span className="about-fact-value">
                    500+
                  </span>
                  <span className="about-fact-label">
                    Products
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <div className="about-divider" />

      {/* =========================
          WHY PLANT HOUSE
      ========================= */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-centered-heading">

            <div className="about-section-label">
              Why Plant House
            </div>

            <h2 className="about-heading">
              Growing with
              <br />
              <span className="about-green">
                purpose.
              </span>
            </h2>

            <p className="about-subtext">
              Everything we do is built around healthy plants,
              simple care and a better experience for plant lovers.
            </p>

          </div>

          <div className="about-values-grid">

            {values.map((value) => (
              <div
                className="about-value-card"
                key={value.title}
              >

                <div className="about-value-number">
                  {value.icon}
                </div>

                <h3 className="about-value-title">
                  {value.title}
                </h3>

                <p className="about-value-desc">
                  {value.desc}
                </p>

                <div className="about-value-decoration" />

              </div>
            ))}

          </div>

        </div>

      </section>

      <div className="about-divider" />

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="about-section about-category-section">

        <div className="about-container">

          <div className="about-centered-heading">

            <div className="about-section-label">
              Our Collection
            </div>

            <h2 className="about-heading">
              Find the right
              <br />
              <span className="about-green">
                plant for you.
              </span>
            </h2>

            <p className="about-subtext">
              From low-maintenance indoor plants to colorful
              flowering varieties, discover something that
              fits your space and lifestyle.
            </p>

          </div>

          <div className="about-category-grid">

            {categories.map((category) => (
              <div
                key={category}
                className="about-category"
              >
                {category}
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================
          JOURNEY
      ========================= */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-centered-heading">

            <div className="about-section-label">
              Our Journey
            </div>

            <h2 className="about-heading">
              Growing one
              <br />
              <span className="about-green">
                step at a time.
              </span>
            </h2>

          </div>

          <div className="about-timeline">

            {[
              {
                year: "2021",
                title: "The Beginning",
                desc: "Plant House started with a simple dream — make beautiful and healthy plants easier to discover and bring home.",
              },
              {
                year: "2022",
                title: "Growing Our Collection",
                desc: "We expanded our collection with indoor plants, flowering plants, succulents, planters and essential care products.",
              },
              {
                year: "2023",
                title: "Growing Across India",
                desc: "More plant lovers joined our community as we worked to make reliable plant delivery available to customers across the country.",
              },
              {
                year: "2024",
                title: "A Growing Community",
                desc: "Plant House reached thousands of plant parents and continued improving the shopping and plant-care experience.",
              },
              {
                year: "2025",
                title: "Growing Greener",
                desc: "We continue building a thoughtful catalogue of plants and products while helping more people create greener spaces.",
              },
            ].map((item) => (
              <div
                className="about-timeline-item"
                key={item.year}
              >

                <div className="about-timeline-dot">
                  <div className="about-timeline-dot-inner" />
                </div>

                <div className="about-timeline-card">

                  <span className="about-year">
                    {item.year}
                  </span>

                  <h3 className="about-timeline-title">
                    {item.title}
                  </h3>

                  <p className="about-timeline-desc">
                    {item.desc}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      <div className="about-divider" />

      {/* =========================
          TEAM
      ========================= */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-centered-heading">

            <div className="about-section-label">
              The People Behind Plant House
            </div>

            <h2 className="about-heading">
              Meet the
              <br />
              <span className="about-green">
                Plant House team.
              </span>
            </h2>

            <p className="about-subtext">
              A small team with a big love for plants,
              technology and creating better experiences.
            </p>

          </div>

          <div className="about-team-grid">

            {team.map((member) => (
              <div
                className="about-team-card"
                key={member.name}
              >

                <div className="about-avatar">
                  <span>
                    {member.initials}
                  </span>
                </div>

                <p className="about-team-name">
                  {member.name}
                </p>

                <p className="about-team-role">
                  {member.role}
                </p>

                <p className="about-team-bio">
                  {member.bio}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="about-cta-section">

        <div className="about-cta">

          <div className="about-cta-circle-one" />
          <div className="about-cta-circle-two" />

          <div className="about-cta-content">

            <div className="about-cta-label">
              Your greener space starts here
            </div>

            <h2 className="about-cta-title">
              Bring a little more life into your home.
            </h2>

            <p className="about-cta-text">
              Explore beautiful plants, stylish planters and
              easy-care essentials made for modern plant lovers.
            </p>

            <Link
              to="/products"
              className="about-cta-button"
            >
              Explore Plants
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}