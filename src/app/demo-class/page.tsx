"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Download,
  Sparkles,
} from "lucide-react";

const COURSES = [
  "Full Stack Web Development",
  "AI Content & Video Creation",
  "Full Stack Graphic Designing",
  "Digital Marketing",
  "Cyber Security & Ethical Hacking",
  "E-Commerce",
];

interface DemoFormData {
  name: string;
  email: string;
  phone: string;
  interestedCourses: string[];
  city: string;
  message: string;
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function drawCard(canvas: HTMLCanvasElement, name: string, course: string): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // ── BRAND COLORS (from logo) ─────────────────────────
  const BG1 = "#22c55e";  // brand green
  const BT1 = "#06b6d4";  // brand teal
  const BB1 = "#0575E6";  // brand blue
  const BI1 = "#6366f1";  // brand indigo

  const W = 1400;
  const H = 900;
  canvas.width = W;
  canvas.height = H;

  // Load logo
  let logo: HTMLImageElement | null = null;
  try {
    logo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/TACHZOQ SKILLS_LOGO_GRADIANTS.png";
    });
  } catch { /* skip logo on error */ }

  // ── BACKGROUND ──────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#020d1a");
  bg.addColorStop(0.5, "#050f1f");
  bg.addColorStop(1, "#020d1a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Brand-colored radial glows
  ([
    [W * 0.22, H * 0.45, 360, "rgba(34,197,94,0.10)"],
    [W * 0.80, H * 0.50, 420, "rgba(5,117,230,0.10)"],
    [W * 0.52, H * 0.50, 580, "rgba(99,102,241,0.05)"],
    [W * 0.10, H * 0.12, 200, "rgba(6,182,212,0.08)"],
    [W * 0.90, H * 0.88, 240, "rgba(34,197,94,0.07)"],
  ] as [number,number,number,string][]).forEach(([gx, gy, gr, gc]) => {
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    g.addColorStop(0, gc);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // Dot grid
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.fillStyle = "#ffffff";
  for (let gx = 28; gx < W; gx += 36) {
    for (let gy = 28; gy < H; gy += 36) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Stars
  ([[90,52,2],[210,130,1.5],[370,72,1.8],[590,42,1.2],[770,82,2],[990,32,1.5],
    [1130,105,2.2],[1290,58,1],[1368,88,1.8],[58,238,1.2],[155,308,2],
    [1208,268,1.5],[1385,188,1.8],[68,488,1.5],[128,638,1],[1308,428,1.8],
    [1392,558,2],[88,798,1.2],[428,858,1.8],[878,848,1],[1372,812,2],
  ] as [number,number,number][]).forEach(([sx, sy, sr]) => {
    ctx.save();
    ctx.globalAlpha = 0.5;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.5);
    sg.addColorStop(0, "#ffffff");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // ── BORDER — brand gradient ───────────────────────────
  // Outer glowing border
  ctx.save();
  ctx.shadowColor = BG1;
  ctx.shadowBlur = 22;
  const outerBG = ctx.createLinearGradient(0, 0, W, H);
  outerBG.addColorStop(0, BG1);
  outerBG.addColorStop(0.33, BT1);
  outerBG.addColorStop(0.66, BB1);
  outerBG.addColorStop(1, BI1);
  ctx.strokeStyle = outerBG;
  ctx.lineWidth = 3;
  ctx.strokeRect(13, 13, W - 26, H - 26);
  ctx.restore();
  // Mid border
  const midBG = ctx.createLinearGradient(0, 0, W, H);
  midBG.addColorStop(0, "rgba(34,197,94,0.18)");
  midBG.addColorStop(0.5, "rgba(6,182,212,0.18)");
  midBG.addColorStop(1, "rgba(99,102,241,0.18)");
  ctx.strokeStyle = midBG;
  ctx.lineWidth = 1;
  ctx.strokeRect(21, 21, W - 42, H - 42);
  // Inner border
  const innerBG = ctx.createLinearGradient(0, 0, W, H);
  innerBG.addColorStop(0, "rgba(34,197,94,0.09)");
  innerBG.addColorStop(1, "rgba(99,102,241,0.09)");
  ctx.strokeStyle = innerBG;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Corner ornaments — each corner gets its brand color
  const cornerColors = [BG1, BT1, BB1, BI1];
  ([[28,28,1,1],[W-28,28,-1,1],[28,H-28,1,-1],[W-28,H-28,-1,-1]] as [number,number,number,number][]).forEach(
    ([cx, cy, sx, sy], i) => {
      const cc = cornerColors[i];
      ctx.save();
      ctx.fillStyle = cc;
      ctx.shadowColor = cc;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 12 * sy);
      ctx.lineTo(cx + 12 * sx, cy);
      ctx.lineTo(cx, cy + 12 * sy);
      ctx.lineTo(cx - 12 * sx, cy);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `${cc}88`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 13 * sx, cy);
      ctx.lineTo(cx + 55 * sx, cy);
      ctx.moveTo(cx, cy + 13 * sy);
      ctx.lineTo(cx, cy + 55 * sy);
      ctx.stroke();
      [30, 42, 53].forEach((d) => {
        ctx.fillStyle = `${cc}70`;
        ctx.beginPath(); ctx.arc(cx + d * sx, cy, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy + d * sy, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    }
  );

  // ── LEFT PANEL ───────────────────────────────────────
  const DIVX = 395;
  const LCX = 197;

  // Vertical divider — brand gradient
  const divG = ctx.createLinearGradient(0, 55, 0, H - 55);
  divG.addColorStop(0, "rgba(34,197,94,0)");
  divG.addColorStop(0.2, "rgba(34,197,94,0.6)");
  divG.addColorStop(0.5, "rgba(6,182,212,0.9)");
  divG.addColorStop(0.8, "rgba(99,102,241,0.6)");
  divG.addColorStop(1, "rgba(99,102,241,0)");
  ctx.fillStyle = divG;
  ctx.fillRect(DIVX, 55, 2, H - 110);

  // Logo image
  if (logo) {
    const logoMaxW = 290;
    const logoMaxH = 145;
    const logoAR = logo.naturalWidth / logo.naturalHeight;
    let lw = logoMaxW;
    let lh = lw / logoAR;
    if (lh > logoMaxH) { lh = logoMaxH; lw = lh * logoAR; }
    ctx.drawImage(logo, LCX - lw / 2, 48, lw, lh);
  } else {
    ctx.save();
    ctx.shadowColor = BG1;
    ctx.shadowBlur = 16;
    const brandG = ctx.createLinearGradient(LCX - 80, 0, LCX + 80, 0);
    brandG.addColorStop(0, BG1);
    brandG.addColorStop(0.5, BT1);
    brandG.addColorStop(1, BB1);
    ctx.fillStyle = brandG;
    ctx.font = "900 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("TECHZOQ SKILLS", LCX, 110);
    ctx.restore();
  }

  // Thin separator below logo
  const sepG = ctx.createLinearGradient(LCX - 100, 0, LCX + 100, 0);
  sepG.addColorStop(0, "rgba(34,197,94,0)");
  sepG.addColorStop(0.5, "rgba(6,182,212,0.45)");
  sepG.addColorStop(1, "rgba(34,197,94,0)");
  ctx.fillStyle = sepG;
  ctx.fillRect(LCX - 100, 206, 200, 1);

  // Vertical label on far left
  ctx.save();
  ctx.translate(38, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.globalAlpha = 0.15;
  const vlG = ctx.createLinearGradient(-160, 0, 160, 0);
  vlG.addColorStop(0, BG1); vlG.addColorStop(1, BI1);
  ctx.fillStyle = vlG;
  ctx.font = "700 12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("D E M O   C L A S S   I N V I T A T I O N", 0, 0);
  ctx.restore();

  // ── MEDALLION ────────────────────────────────────────
  const MCY = 450;

  // Ray burst — brand gradient
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const isMain = i % 3 === 0;
    const t = i / 24;
    const rr2 = Math.round(34 + (99 - 34) * t);
    const rg2 = Math.round(197 + (102 - 197) * t);
    const rb2 = Math.round(94 + (241 - 94) * t);
    ctx.save();
    ctx.globalAlpha = isMain ? 0.13 : 0.06;
    ctx.strokeStyle = `rgb(${rr2},${rg2},${rb2})`;
    ctx.lineWidth = isMain ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(LCX + Math.cos(angle) * 108, MCY + Math.sin(angle) * 108);
    ctx.lineTo(LCX + Math.cos(angle) * 166, MCY + Math.sin(angle) * 166);
    ctx.stroke();
    ctx.restore();
  }

  // Glow rings
  [200, 168, 136].forEach((r, i) => {
    ctx.save();
    ctx.globalAlpha = [0.03, 0.06, 0.09][i];
    const rGrd = ctx.createRadialGradient(LCX, MCY, 0, LCX, MCY, r);
    rGrd.addColorStop(0, BT1);
    rGrd.addColorStop(1, BG1);
    ctx.beginPath();
    ctx.arc(LCX, MCY, r, 0, Math.PI * 2);
    ctx.fillStyle = rGrd;
    ctx.fill();
    ctx.restore();
  });

  // Dashed orbit — gradient dots
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const t = i / 36;
    const dr = Math.round(34 + (99 - 34) * t);
    const dg = Math.round(197 + (102 - 197) * t);
    const db = Math.round(94 + (241 - 94) * t);
    if (i % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(LCX + Math.cos(angle) * 128, MCY + Math.sin(angle) * 128, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${dr},${dg},${db})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Main medal circle — green→teal→blue
  const medalG = ctx.createRadialGradient(LCX - 35, MCY - 35, 4, LCX, MCY, 104);
  medalG.addColorStop(0, "#d1fae5");
  medalG.addColorStop(0.22, "#6ee7b7");
  medalG.addColorStop(0.52, "#06b6d4");
  medalG.addColorStop(0.78, "#0575E6");
  medalG.addColorStop(1, "#1e3a8a");
  ctx.save();
  ctx.shadowColor = BT1;
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.arc(LCX, MCY, 104, 0, Math.PI * 2);
  ctx.fillStyle = medalG;
  ctx.fill();
  ctx.restore();

  // Inner groove
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(LCX, MCY, 84, 0, Math.PI * 2);
  ctx.stroke();

  // 6-point star — green-white
  const starG = ctx.createRadialGradient(LCX - 14, MCY - 14, 0, LCX, MCY, 68);
  starG.addColorStop(0, "#ffffff");
  starG.addColorStop(0.3, "#d1fae5");
  starG.addColorStop(0.7, "#a7f3d0");
  starG.addColorStop(1, "#6ee7b7");
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.5)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const rd = i % 2 === 0 ? 68 : 30;
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const px = LCX + Math.cos(angle) * rd;
    const py = MCY + Math.sin(angle) * rd;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = starG;
  ctx.fill();
  ctx.restore();

  // Checkmark
  ctx.save();
  ctx.strokeStyle = "#065f46";
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(LCX - 23, MCY);
  ctx.lineTo(LCX - 7, MCY + 19);
  ctx.lineTo(LCX + 27, MCY - 19);
  ctx.stroke();
  ctx.restore();

  // Sparkle ✦ dots — cycling brand colors
  const sparkleColors = [BG1, BT1, BB1, BI1, BG1, BT1, BB1, BI1];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = sparkleColors[i];
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("\u2726", LCX + Math.cos(angle) * 124, MCY + Math.sin(angle) * 124 + 5);
    ctx.restore();
  }

  // Verified seal
  const SEALY = H - 112;
  ctx.save();
  ctx.beginPath();
  ctx.arc(LCX, SEALY, 48, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(34,197,94,0.07)";
  ctx.fill();
  for (let i = 0; i < 24; i++) {
    if (i % 2 === 0) {
      const a1 = (i / 24) * Math.PI * 2;
      const a2 = ((i + 0.8) / 24) * Math.PI * 2;
      const t = i / 24;
      const sr = Math.round(34 + (99-34)*t), sg = Math.round(197+(102-197)*t), sb = Math.round(94+(241-94)*t);
      ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.75)`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(LCX, SEALY, 48, a1, a2); ctx.stroke();
    }
  }
  ctx.strokeStyle = BG1;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(LCX - 17, SEALY);
  ctx.lineTo(LCX - 4, SEALY + 14);
  ctx.lineTo(LCX + 19, SEALY - 13);
  ctx.stroke();
  const sealG = ctx.createLinearGradient(LCX - 80, 0, LCX + 80, 0);
  sealG.addColorStop(0, BG1);
  sealG.addColorStop(1, BB1);
  ctx.fillStyle = sealG;
  ctx.font = "700 10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("VERIFIED  \u2022  APPROVED", LCX, SEALY + 36);
  ctx.restore();

  // ── RIGHT PANEL ──────────────────────────────────────
  const RX = DIVX + 38;
  const RW = W - RX - 50;
  const RCX = RX + RW / 2;

  // "ACHIEVEMENT PASS" badge
  const badgeW = 290;
  const badgeH = 44;
  const badgeX = RCX - badgeW / 2;
  ctx.save();
  ctx.shadowColor = BB1;
  ctx.shadowBlur = 28;
  const badgeG = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  badgeG.addColorStop(0, "#0a2145");
  badgeG.addColorStop(0.5, "#1d4ed8");
  badgeG.addColorStop(1, "#0a2145");
  ctx.fillStyle = badgeG;
  rr(ctx, badgeX, 62, badgeW, badgeH, 22);
  ctx.fill();
  const badgeBorderG = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  badgeBorderG.addColorStop(0, "rgba(6,182,212,0)");
  badgeBorderG.addColorStop(0.4, "rgba(6,182,212,0.55)");
  badgeBorderG.addColorStop(1, "rgba(99,102,241,0.3)");
  ctx.strokeStyle = badgeBorderG;
  ctx.lineWidth = 1.5;
  rr(ctx, badgeX, 62, badgeW, badgeH, 22);
  ctx.stroke();
  ctx.restore();
  const btG = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  btG.addColorStop(0, "#6ee7b7");
  btG.addColorStop(0.5, "#bae6fd");
  btG.addColorStop(1, "#c4b5fd");
  ctx.fillStyle = btG;
  ctx.font = "700 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("\u2b50  ACHIEVEMENT PASS  \u2b50", RCX, 89);

  // ── MAIN TITLE — brand gradient ──────────────────────
  const titleY = 195;
  ctx.save();
  ctx.shadowColor = "rgba(6,182,212,0.5)";
  ctx.shadowBlur = 44;
  const titleG = ctx.createLinearGradient(RCX - 310, 0, RCX + 310, 0);
  titleG.addColorStop(0, BG1);
  titleG.addColorStop(0.3, BT1);
  titleG.addColorStop(0.55, "#60a5fa");
  titleG.addColorStop(0.8, BB1);
  titleG.addColorStop(1, BI1);
  ctx.fillStyle = titleG;
  ctx.font = "900 96px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("DEMO CLASS", RCX, titleY);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "300 18px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("I  N  V  I  T  A  T  I  O  N", RCX, titleY + 42);

  // Decorative divider — brand gradient
  const DY = titleY + 64;
  const lgL = ctx.createLinearGradient(RCX - 250, 0, RCX - 24, 0);
  lgL.addColorStop(0, "rgba(34,197,94,0)");
  lgL.addColorStop(1, "rgba(6,182,212,0.8)");
  ctx.fillStyle = lgL;
  ctx.fillRect(RCX - 250, DY, 224, 1.5);
  const lgR = ctx.createLinearGradient(RCX + 24, 0, RCX + 250, 0);
  lgR.addColorStop(0, "rgba(6,182,212,0.8)");
  lgR.addColorStop(1, "rgba(99,102,241,0)");
  ctx.fillStyle = lgR;
  ctx.fillRect(RCX + 24, DY, 224, 1.5);
  // Center diamond in teal→blue
  const diamG = ctx.createLinearGradient(RCX - 10, 0, RCX + 10, 0);
  diamG.addColorStop(0, BT1);
  diamG.addColorStop(1, BB1);
  ctx.fillStyle = diamG;
  ctx.beginPath();
  ctx.moveTo(RCX, DY - 8);
  ctx.lineTo(RCX + 10, DY + 0.75);
  ctx.lineTo(RCX, DY + 9);
  ctx.lineTo(RCX - 10, DY + 0.75);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "300 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("This certifies that", RCX, DY + 40);

  // ── NAME ─────────────────────────────────────────────
  const nameY = DY + 114;
  const truncName = name.length > 24 ? `${name.substring(0, 24)}...` : name;
  const nameFontSize = truncName.length > 18 ? 56 : 68;
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.22)";
  ctx.shadowBlur = 26;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${nameFontSize}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncName.toUpperCase(), RCX, nameY);
  ctx.restore();

  // Dashed underline — brand gradient
  ctx.save();
  const ulG = ctx.createLinearGradient(RCX - 220, 0, RCX + 220, 0);
  ulG.addColorStop(0, "rgba(34,197,94,0)");
  ulG.addColorStop(0.3, "rgba(6,182,212,0.4)");
  ulG.addColorStop(0.7, "rgba(5,117,230,0.4)");
  ulG.addColorStop(1, "rgba(99,102,241,0)");
  ctx.strokeStyle = ulG;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 7]);
  ctx.beginPath();
  ctx.moveTo(RCX - 210, nameY + 14);
  ctx.lineTo(RCX + 210, nameY + 14);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.font = "300 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("has been selected to attend the exclusive", RCX, nameY + 44);

  // ── COURSE PILLS ─────────────────────────────────────
  const courses = course.split(", ").filter(Boolean);
  const pillStartY = nameY + 82;
  const pillFont = "700 13px system-ui";
  ctx.font = pillFont;

  const pillThemes = [
    { bg0: "#064e3b", bg1: "#065f46", border: "rgba(34,197,94,0.4)", txt0: BG1, txt1: "#6ee7b7" },
    { bg0: "#0c4a6e", bg1: "#075985", border: "rgba(6,182,212,0.4)", txt0: BT1, txt1: "#7dd3fc" },
    { bg0: "#1e3a8a", bg1: "#1d4ed8", border: "rgba(5,117,230,0.4)", txt0: BB1, txt1: "#93c5fd" },
    { bg0: "#3b0764", bg1: "#4c1d95", border: "rgba(99,102,241,0.4)", txt0: BI1, txt1: "#c4b5fd" },
  ];

  if (courses.length === 1) {
    const pw = Math.min(Math.max(ctx.measureText(courses[0]).width + 90, 290), RW - 60);
    const pt = pillThemes[0];
    ctx.save();
    ctx.shadowColor = BG1;
    ctx.shadowBlur = 24;
    const p1G = ctx.createLinearGradient(RCX - pw / 2, 0, RCX + pw / 2, 0);
    p1G.addColorStop(0, pt.bg0);
    p1G.addColorStop(1, pt.bg1);
    ctx.fillStyle = p1G;
    rr(ctx, RCX - pw / 2, pillStartY, pw, 46, 23);
    ctx.fill();
    const p1BG = ctx.createLinearGradient(RCX - pw / 2, 0, RCX + pw / 2, 0);
    p1BG.addColorStop(0, "rgba(34,197,94,0.2)");
    p1BG.addColorStop(1, "rgba(6,182,212,0.45)");
    ctx.strokeStyle = p1BG;
    ctx.lineWidth = 1.5;
    rr(ctx, RCX - pw / 2, pillStartY, pw, 46, 23);
    ctx.stroke();
    ctx.restore();
    const p1TG = ctx.createLinearGradient(RCX - pw / 2, 0, RCX + pw / 2, 0);
    p1TG.addColorStop(0, pt.txt0);
    p1TG.addColorStop(1, pt.txt1);
    ctx.fillStyle = p1TG;
    ctx.font = "700 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(courses[0], RCX, pillStartY + 32);
  } else {
    const pH = 34; const pPad = 18; const pGap = 10;
    const maxLW = RW - 20;
    ctx.font = pillFont;
    const widths = courses.map((c) => ctx.measureText(c).width + pPad * 2);
    const rows: { text: string; width: number; idx: number }[][] = [];
    let currRow: { text: string; width: number; idx: number }[] = [];
    let currW = 0;
    courses.forEach((c, i) => {
      const cw = widths[i];
      const needed = currW + (currRow.length > 0 ? pGap : 0) + cw;
      if (needed > maxLW && currRow.length > 0) {
        rows.push(currRow); currRow = [{ text: c, width: cw, idx: i }]; currW = cw;
      } else {
        if (currRow.length > 0) currW += pGap;
        currRow.push({ text: c, width: cw, idx: i }); currW += cw;
      }
    });
    if (currRow.length) rows.push(currRow);
    let py = pillStartY;
    rows.forEach((row) => {
      const rowW = row.reduce((a, p, i) => a + p.width + (i > 0 ? pGap : 0), 0);
      let px = RCX - rowW / 2;
      row.forEach(({ text, width, idx }) => {
        const pt = pillThemes[idx % pillThemes.length];
        ctx.save();
        ctx.shadowColor = pt.txt0;
        ctx.shadowBlur = 10;
        const pBG = ctx.createLinearGradient(px, 0, px + width, 0);
        pBG.addColorStop(0, pt.bg0);
        pBG.addColorStop(1, pt.bg1);
        ctx.fillStyle = pBG;
        rr(ctx, px, py, width, pH, pH / 2);
        ctx.fill();
        ctx.strokeStyle = pt.border;
        ctx.lineWidth = 1;
        rr(ctx, px, py, width, pH, pH / 2);
        ctx.stroke();
        ctx.restore();
        const pTG = ctx.createLinearGradient(px, 0, px + width, 0);
        pTG.addColorStop(0, pt.txt0);
        pTG.addColorStop(1, pt.txt1);
        ctx.fillStyle = pTG;
        ctx.font = pillFont;
        ctx.textAlign = "center";
        ctx.fillText(text, px + width / 2, py + pH / 2 + 5);
        px += width + pGap;
      });
      py += pH + 9;
    });
  }

  // ── DATE / TIME STRIP ─────────────────────────────────
  const stripY = H - 188;
  ctx.save();
  const sG = ctx.createLinearGradient(RX, stripY, RX + RW, stripY);
  sG.addColorStop(0, "rgba(2,13,26,0.97)");
  sG.addColorStop(0.5, "rgba(8,18,42,0.72)");
  sG.addColorStop(1, "rgba(2,13,26,0.97)");
  ctx.fillStyle = sG;
  rr(ctx, RX, stripY, RW, 104, 14);
  ctx.fill();
  // Brand gradient strip border
  const stripBG = ctx.createLinearGradient(RX, 0, RX + RW, 0);
  stripBG.addColorStop(0, "rgba(34,197,94,0.15)");
  stripBG.addColorStop(0.35, "rgba(6,182,212,0.35)");
  stripBG.addColorStop(0.65, "rgba(5,117,230,0.35)");
  stripBG.addColorStop(1, "rgba(99,102,241,0.15)");
  ctx.strokeStyle = stripBG;
  ctx.lineWidth = 1.5;
  rr(ctx, RX, stripY, RW, 104, 14);
  ctx.stroke();
  ctx.restore();

  const c1x = RX + RW * 0.18;
  const c2x = RX + RW * 0.5;
  const c3x = RX + RW * 0.82;
  const lbY = stripY + 28; const vY = stripY + 58; const sbY = stripY + 80;

  // Dividers
  [[RX + RW * 0.34, BT1], [RX + RW * 0.66, BB1]].forEach(([dx, dc]) => {
    const dlG = ctx.createLinearGradient(0, stripY + 16, 0, stripY + 88);
    dlG.addColorStop(0, "rgba(0,0,0,0)");
    dlG.addColorStop(0.5, `${dc}66`);
    dlG.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = dlG;
    ctx.fillRect(dx as number, stripY + 16, 1, 72);
  });

  // Date
  const lbG1 = ctx.createLinearGradient(c1x - 55, 0, c1x + 55, 0);
  lbG1.addColorStop(0, BG1); lbG1.addColorStop(1, BT1);
  ctx.fillStyle = lbG1;
  ctx.font = "700 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("\uD83D\uDCC5  DATE", c1x, lbY);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 21px system-ui";
  ctx.fillText("28 March 2026", c1x, vY);
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "400 13px system-ui";
  ctx.fillText("Saturday", c1x, sbY);

  // Time
  const lbG2 = ctx.createLinearGradient(c2x - 55, 0, c2x + 55, 0);
  lbG2.addColorStop(0, BT1); lbG2.addColorStop(1, BB1);
  ctx.fillStyle = lbG2;
  ctx.font = "700 11px system-ui";
  ctx.fillText("\u23F0  TIME", c2x, lbY);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 21px system-ui";
  ctx.fillText("3:00 PM  (PKT)", c2x, vY);
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "400 13px system-ui";
  ctx.fillText("Pakistan Standard Time", c2x, sbY);

  // Punctuality
  ctx.save();
  ctx.shadowColor = BB1;
  ctx.shadowBlur = 14;
  const lbG3 = ctx.createLinearGradient(c3x - 55, 0, c3x + 55, 0);
  lbG3.addColorStop(0, BB1); lbG3.addColorStop(1, BI1);
  ctx.fillStyle = lbG3;
  ctx.font = "700 11px system-ui";
  ctx.fillText("\u26A1  PUNCTUALITY", c3x, lbY);
  ctx.restore();
  ctx.fillStyle = "#bfdbfe";
  ctx.font = "800 21px system-ui";
  ctx.fillText("BE ON TIME!", c3x, vY);
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "400 13px system-ui";
  ctx.fillText("Please arrive before 3:00 PM", c3x, sbY);

  // ── FOOTER ────────────────────────────────────────────
  const footY = H - 62;
  const fG = ctx.createLinearGradient(55, 0, W - 55, 0);
  fG.addColorStop(0, "rgba(34,197,94,0)");
  fG.addColorStop(0.25, "rgba(34,197,94,0.22)");
  fG.addColorStop(0.5, "rgba(6,182,212,0.35)");
  fG.addColorStop(0.75, "rgba(5,117,230,0.22)");
  fG.addColorStop(1, "rgba(99,102,241,0)");
  ctx.fillStyle = fG;
  ctx.fillRect(55, footY, W - 110, 1);

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "400 11px system-ui";
  ctx.textAlign = "left";
  ctx.fillText("www.techzoq.com", 62, footY + 26);

  ctx.textAlign = "center";
  const ftG = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
  ftG.addColorStop(0, "rgba(34,197,94,0.35)");
  ftG.addColorStop(0.5, "rgba(6,182,212,0.55)");
  ftG.addColorStop(1, "rgba(99,102,241,0.35)");
  ctx.fillStyle = ftG;
  ctx.font = "600 11px system-ui";
  ctx.fillText(
    "Present this pass upon arrival  \u2022  Limited seats  \u2022  Non-transferable",
    W / 2, footY + 26,
  );

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "400 11px system-ui";
  ctx.fillText("28 - 03 - 2026", W - 62, footY + 26);
}

export default function DemoClassPage() {
  const [formData, setFormData] = useState<DemoFormData>({
    name: "",
    email: "",
    phone: "",
    interestedCourses: [],
    city: "",
    message: "",
  });
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    course: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseToggle = (course: string) => {
    setFormData((prev) => ({
      ...prev,
      interestedCourses: prev.interestedCourses.includes(course)
        ? prev.interestedCourses.filter((c) => c !== course)
        : [...prev.interestedCourses, course],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/demo-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmittedData({
          name: formData.name,
          course: formData.interestedCourses.join(", "),
        });
        setFormData({ name: "", email: "", phone: "", interestedCourses: [], city: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCard = useCallback(async () => {
    if (!canvasRef.current || !submittedData) return;
    await drawCard(canvasRef.current, submittedData.name, submittedData.course);
    const link = document.createElement("a");
    link.download = "Techzoq-Demo-Class-Pass.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }, [submittedData]);

  // Auto-download the card as soon as the success state renders the canvas
  useEffect(() => {
    if (submittedData) {
      // Small delay to ensure the canvas element is mounted in the DOM
      const timer = setTimeout(() => { handleDownloadCard(); }, 300);
      return () => clearTimeout(timer);
    }
  }, [submittedData, handleDownloadCard]);

  return (
    <div className="min-h-screen bg-[#020d1a]">
      <Header />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[420px] bg-green-500/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[360px] bg-blue-600/10 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[280px] bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Limited Seats — Register Now
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight"
          >
            Free{" "}
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Demo Class
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience world-class teaching quality first-hand. Join us this Saturday and discover the course that will transform your career.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold">28 March 2026</span>
              <span className="text-white/40 text-sm">Saturday</span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">3:00 PM PKT</span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-semibold">Please Be On Time</span>
            </div>
          </motion.div>
        </div>
      </section>


      
      {/* ── FORM / SUCCESS ────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {submitStatus === "success" && submittedData ? (
            /* ── SUCCESS STATE ── */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>

              {/* Celebration header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="relative inline-flex items-center justify-center mb-6"
                >
                  <span className="absolute w-32 h-32 rounded-full border border-green-500/20 animate-ping" style={{ animationDuration: "1.8s" }} />
                  <span className="absolute w-24 h-24 rounded-full border border-green-400/30 animate-ping" style={{ animationDuration: "1.4s", animationDelay: "0.2s" }} />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-4xl font-black text-white mb-3">
                  You&apos;re All Set! 🎉
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white/55 text-base">
                  Your registration is confirmed for{" "}
                  <span className="text-cyan-400 font-semibold">Saturday, 28 March 2026 at 3:00 PM</span>
                </motion.p>
              </div>

              {/* Pass Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative rounded-2xl overflow-hidden mb-6 border border-white/10"
                style={{ background: "linear-gradient(135deg, #020d1a 0%, #061428 60%, #020d1a 100%)" }}
              >
                {/* Top gradient bar */}
                <div className="h-1 w-full bg-gradient-to-r from-green-500 via-cyan-400 to-blue-600" />
                {/* Glow orbs */}
                <div className="absolute top-0 left-1/4 w-56 h-56 bg-green-500/8 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-64 h-56 bg-blue-600/8 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative p-8 md:p-10 text-center">
                  {/* Verified badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-bold tracking-wider uppercase mb-6">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified &amp; Approved
                  </span>

                  {/* Title */}
                  <h3 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1 tracking-tight">
                    DEMO CLASS PASS
                  </h3>
                  <p className="text-white/25 text-xs tracking-[0.3em] uppercase mb-6">Achievement Registration</p>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <Sparkles className="w-4 h-4 text-cyan-400/50" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <p className="text-white/35 text-xs tracking-widest uppercase mb-2">This certifies that</p>
                  <p className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-1">
                    {submittedData.name}
                  </p>
                  <p className="text-white/35 text-sm mb-5">is cordially invited to attend the demo session for</p>

                  {/* Course pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-7">
                    {submittedData.course.split(", ").filter(Boolean).map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                        style={{
                          background: ["rgba(34,197,94,0.12)", "rgba(6,182,212,0.12)", "rgba(5,117,230,0.12)", "rgba(99,102,241,0.12)"][i % 4],
                          borderColor: ["rgba(34,197,94,0.3)", "rgba(6,182,212,0.3)", "rgba(5,117,230,0.3)", "rgba(99,102,241,0.3)"][i % 4],
                          color: ["#4ade80", "#22d3ee", "#60a5fa", "#a5b4fc"][i % 4],
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Date / Time strip */}
                  <div className="flex items-center justify-center gap-10 py-5 px-6 rounded-xl bg-white/[0.04] border border-white/[0.07] mb-7">
                    <div className="text-center">
                      <p className="text-white/35 text-[10px] tracking-widest uppercase mb-1">Date</p>
                      <p className="text-white font-bold text-lg">28 March 2026</p>
                      <p className="text-white/35 text-xs">Saturday</p>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="text-center">
                      <p className="text-white/35 text-[10px] tracking-widest uppercase mb-1">Time</p>
                      <p className="text-white font-bold text-lg">3:00 PM</p>
                      <p className="text-cyan-400/70 text-xs font-semibold">Be On Time!</p>
                    </div>
                  </div>

                  <p className="text-white/20 text-xs">
                    Present this pass upon arrival &bull; Limited seats available &bull; Non-transferable
                  </p>
                </div>
              </motion.div>

              {/* Download button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col items-center gap-3"
              >
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #06b6d4, #0575E6)",
                    boxShadow: "0 0 40px rgba(6,182,212,0.22)",
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download Your Demo Class Pass
                </button>
                <p className="text-white/25 text-sm">Save your pass and bring it to the class</p>
              </motion.div>

              {/* Hidden canvas for download */}
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>

          ) : (
            /* ── FORM ── */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Register Now</h2>
                <p className="text-white/45">Fill in your details to reserve your seat</p>
              </div>

              <div
                className="rounded-2xl p-8 md:p-10 border border-white/[0.09]"
                style={{
                  background: "linear-gradient(135deg, #0a1628 0%, #0d1f38 55%, #0a1628 100%)",
                  boxShadow: "0 0 80px rgba(6,182,212,0.05)",
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-white/60 mb-2">
                      <User className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/25 outline-none transition-all border border-white/10 bg-white/[0.05] focus:border-cyan-500/50 focus:bg-white/[0.08]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-white/60 mb-2">
                        <Mail className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                        Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/25 outline-none transition-all border border-white/10 bg-white/[0.05] focus:border-cyan-500/50 focus:bg-white/[0.08]"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/60 mb-2">
                        <Phone className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                        Phone <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/25 outline-none transition-all border border-white/10 bg-white/[0.05] focus:border-cyan-500/50 focus:bg-white/[0.08]"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>

                  {/* Course checkboxes */}
                  <div>
                    <label className="block text-sm font-semibold text-white/60 mb-3">
                      <BookOpen className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Interested Course <span className="text-cyan-400">*</span>
                      <span className="text-xs font-normal text-white/30 ml-1">(select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {COURSES.map((course) => {
                        const checked = formData.interestedCourses.includes(course);
                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => handleCourseToggle(course)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                              checked
                                ? "border-cyan-500/50 bg-cyan-500/10 text-white"
                                : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:bg-white/[0.06]"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                                checked ? "border-cyan-400 bg-cyan-500" : "border-white/20 bg-transparent"
                              }`}
                            >
                              {checked && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span className="text-sm font-medium">{course}</span>
                          </button>
                        );
                      })}
                    </div>
                    {formData.interestedCourses.length === 0 && (
                      <p className="text-xs text-red-400/70 mt-2">Please select at least one course</p>
                    )}
                  </div>

               

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-white/60 mb-2">
                      Message / Notes
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/25 outline-none transition-all border border-white/10 bg-white/[0.05] focus:border-cyan-500/50 focus:bg-white/[0.08] resize-none"
                      placeholder="Any questions or notes? (optional)"
                    />
                  </div>

                  {/* Error */}
                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">Something went wrong. Please try again.</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.interestedCourses.length === 0}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #06b6d4, #0575E6)",
                      boxShadow: "0 0 40px rgba(6,182,212,0.18)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Reserve My Seat
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

