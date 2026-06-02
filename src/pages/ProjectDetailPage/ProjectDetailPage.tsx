import { useParams } from 'react-router-dom';
import { QRCodeSVG } from "qrcode.react";
import { Divider, Image } from "antd";
import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/common/ProjectCard";
import { PROJECTS_DATA, MEMBERS_DATA } from "@/data";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// ─── Social icons via @iconify/react ─────────────────────────────────────────
const SOCIAL_ICON_MAP: Record<string, string> = {
  youtube: "mdi:youtube",
  facebook: "mdi:facebook",
  twitter: "fa6-brands:x-twitter",
  instagram: "mdi:instagram",
  linkedin: "mdi:linkedin",
  tiktok: "ic:baseline-tiktok",
};

// ─── QR section ───────────────────────────────────────────────────────────────
const QR_CONIC =
  "conic-gradient(from 0deg at 50% 50%, #EE334E 0deg, #FCB131 90deg, #00A651 180deg, #0081C8 270deg, #EE334E 360deg)";

// function QRSection({ value }: { value: string }) {
//   return (
//     // Wrapper: relative to hold the absolute arrow below xl
//     <div
//       className="flex-shrink-0 relative pb-0 xl:pb-[100px]"
//       // min-width ensures it never squeezes to zero on mid-range desktops
//       style={{ minWidth: 0 }}
//     >
//       {/* Row: text (right-aligned) + rotated QR box */}
//       <div className="flex items-center gap-[18px]">

//         {/* Text — fluid width, right-aligned, italic */}
//         <div style={{ width: 'clamp(160px, 16vw, 307px)', textAlign: 'right', flexShrink: 0 }}>
//           <span
//             style={{
//               display: 'block',
//               fontFamily: 'Open Sans, sans-serif',
//               fontWeight: 600,
//               fontStyle: 'italic',
//               fontSize: 'clamp(0.875rem, 1.04vw, 1.25rem)',
//               lineHeight: '150%',
//               color: '#000000',
//             }}
//           >
//             Support our Mission
//           </span>
//           <span
//             style={{
//               display: 'block',
//               fontFamily: 'Open Sans, sans-serif',
//               fontWeight: 400,
//               fontStyle: 'italic',
//               fontSize: 'clamp(0.75rem, 0.94vw, 1.125rem)',
//               lineHeight: '150%',
//               color: '#000000',
//             }}
//           >
//             Send your spiritual or financial support to this organization
//           </span>
//         </div>

//         {/* QR box — outer rotated + inner float animation */}
//         {/* Outer: static 15° rotation */}
//         <div style={{ transform: 'rotate(15deg)', transformOrigin: 'center', flexShrink: 0 }}>
//           {/* Inner: float-y animation (pure translateY, no rotation conflict) */}
//           <div className="animate-float-y">
//             <div
//               style={{
//                 width: 'clamp(120px, 8.75vw, 168px)',
//                 height: 'clamp(120px, 8.75vw, 168px)',
//                 background: QR_CONIC,
//                 borderRadius: '16px',
//                 padding: '8px',
//                 boxSizing: 'border-box',
//               }}
//             >
//               <div
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   background: '#ffffff',
//                   borderRadius: '11px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <QRCodeSVG value={value} size={100} bgColor="#ffffff" fgColor="#000000" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashed rainbow arrow — scales proportionally with viewport so it never overlaps QR box.
//           Container width/left use clamp() to match the proportional position of the text area. */}
//       <div
//         className="hidden xl:block absolute pointer-events-none"
//         style={{
//           top: 'clamp(90px, 6.5vw, 125px)',
//           left: 'clamp(40px, 3.1vw, 60px)',
//           width: 'clamp(150px, 12.5vw, 240px)',
//         }}
//       >
//         {/* preserveAspectRatio keeps the curve shape; vectorEffect keeps stroke at 2px regardless of scale */}
//         <svg
//           width="100%"
//           height="auto"
//           viewBox="0 0 280 115"
//           preserveAspectRatio="xMinYMin meet"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <defs>
//             <linearGradient id="arrowRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%"   stopColor="#EE334E" />
//               <stop offset="33%"  stopColor="#FCB131" />
//               <stop offset="67%"  stopColor="#00A651" />
//               <stop offset="100%" stopColor="#0081C8" />
//             </linearGradient>
//           </defs>
//           <path
//             d="M 8,105 C 45,95 65,58 92,68 C 119,78 104,40 133,32 C 162,24 210,20 268,14"
//             stroke="url(#arrowRainbow)"
//             strokeWidth="2"
//             strokeDasharray="5,5"
//             strokeLinecap="round"
//             fill="none"
//             vectorEffect="non-scaling-stroke"
//           />
//           <path
//             d="M 260,6 L 272,16 L 262,24"
//             stroke="#0081C8"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             fill="none"
//             vectorEffect="non-scaling-stroke"
//           />
//         </svg>
//       </div>
//     </div>
//   );
// }

// ─── Detail row ───────────────────────────────────────────────────────────────
function QRSection({ value }: { value: string }) {
  return (
    // Wrapper: relative to hold the absolute arrow below xl
    <div
      className="flex-shrink-0 relative pb-0 xl:pb-[100px]"
      // min-width ensures it never squeezes to zero on mid-range desktops
      style={{ minWidth: 0 }}
    >
      {/* Row: text (right-aligned) + rotated QR box */}
      <div className="flex items-center gap-[18px]">
        {/* Text — fluid width, right-aligned, italic */}
        <div
          style={{
            width: "clamp(160px, 16vw, 307px)",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "Open Sans, sans-serif",
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: "clamp(0.875rem, 1.04vw, 1.25rem)",
              lineHeight: "150%",
              color: "#000000",
            }}
          >
            Support our Mission
          </span>
          <span
            style={{
              display: "block",
              fontFamily: "Open Sans, sans-serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(0.75rem, 0.94vw, 1.125rem)",
              lineHeight: "150%",
              color: "#000000",
            }}
          >
            Send your spiritual or financial support to this organization
          </span>
        </div>

        {/* QR box — outer rotated + inner float animation */}
        <div
          style={{
            transform: "rotate(15deg)",
            transformOrigin: "center",
            flexShrink: 0,
          }}
        >
          <div className="animate-float-y">
            <div
              style={{
                width: "clamp(120px, 8.75vw, 168px)",
                height: "clamp(120px, 8.75vw, 168px)",
                background: QR_CONIC,
                borderRadius: "16px",
                padding: "8px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#ffffff",
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRCodeSVG
                  value={value}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ĐÃ FIX CHỨT ĐIỂM: Mũi tên vươn dài, đầu V khóa chặt trỏ thẳng góc 1h ── */}
      {/* ── ĐÃ FIX: Giữ nguyên góc chuẩn 1h nhưng lùi mũi tên lại để tạo khoảng hở với QR ── */}
      <div
        className="hidden xl:block absolute pointer-events-none"
        style={{
          top: "clamp(80px, 6vw, 110px)",
          left: "clamp(35px, 2.8vw, 55px)",
          width: "clamp(180px, 15vw, 280px)", // Giảm nhẹ width để tổng thể không bị với quá
        }}
      >
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 320 130"
          preserveAspectRatio="xMinYMin meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="arrowRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EE334E" />
              <stop offset="33%" stopColor="#FCB131" />
              <stop offset="67%" stopColor="#00A651" />
              <stop offset="100%" stopColor="#0081C8" />
            </linearGradient>
          </defs>

          {/* 1. Thân mũi tên được thu ngắn lại, kết thúc sớm hơn ở tọa độ (275, 42) */}
          <path
            d="M 10,110 C 60,95 90,85 120,80 C 135,78 155,62 148,40 C 138,15 122,30 138,55 C 150,80 185,82 215,70 C 235,62 255,52 275,42"
            stroke="url(#arrowRainbow)"
            strokeWidth="2.5"
            strokeDasharray="6,5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* 2. Đầu chữ V lùi lại tương ứng, vẫn khóa chặt vào thân và giữ nguyên góc đâm */}
          <path
            d="M 260,37 L 275,42 L 265,55"
            stroke="#0081C8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  uploadLink?: boolean;
  children: React.ReactNode;
}

function DetailRow({ label, uploadLink, children }: DetailRowProps) {
  return (
    <div className="flex items-start w-full gap-2">
      <div className="flex-shrink-0 w-[140px] lg:w-[300px]">
        <span
          style={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.8rem, 1.04vw, 1.25rem)",
            lineHeight: "140%",
            color: "#151515",
          }}
        >
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
      {uploadLink && (
        <a
          href="#"
          className="flex-shrink-0 flex items-center gap-1 ml-2 lg:ml-6 hover:opacity-75 transition-opacity"
          style={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(0.8rem, 1.04vw, 1.25rem)",
            color: "#EE334E",
            textDecoration: "none",
          }}
        >
          <span className="hidden sm:inline">Link to upload</span>
          <Icon name="solar:arrow-right-up-bold" size={18} color="#EE334E" />
        </a>
      )}
    </div>
  );
}

const VALUE_STYLE: React.CSSProperties = {
  fontFamily: "Open Sans, sans-serif",
  fontWeight: 500,
  fontSize: "clamp(0.8rem, 1.04vw, 1.25rem)",
  lineHeight: "140%",
  color: "#000000",
};

const GRADIENT_DIVIDER =
  "linear-gradient(90deg, rgba(194,211,239,0) 0%, rgba(194,211,239,1) 20%, rgba(194,211,239,1) 80%, rgba(194,211,239,0) 100%)";

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = PROJECTS_DATA.find((p) => p.id === projectId);

  const { ref: orgRef, visible: orgVisible } = useScrollReveal();
  const { ref: detailRef, visible: detailVisible } = useScrollReveal();
  const { ref: otherRef, visible: otherVisible } = useScrollReveal();

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">
          Project Not Found
        </h2>
      </div>
    );
  }

  const member = MEMBERS_DATA.find((m) => m.id === project.memberId);
  const MEMBER_MAP = Object.fromEntries(
    MEMBERS_DATA.map((m) => [m.id, m.name]),
  );
  const otherProjects = PROJECTS_DATA.filter((p) => p.id !== project.id).slice(
    0,
    3,
  );

  const qrValue =
    member?.socialLinks?.[0]?.url ??
    `https://youthorgunion.org/projects/${project.id}`;

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Decorative ellipses */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-23px",
          left: "-258px",
          width: "963px",
          height: "166px",
          background: "#2980B9",
          filter: "blur(600px)",
          opacity: 0.43,
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-46px",
          left: "1354px",
          width: "570px",
          height: "205px",
          background: "#EE334E",
          filter: "blur(600px)",
          opacity: 0.43,
        }}
      />

      {/* ── Hero: title (left) + QR section (right) ── */}
      <div className="pt-10 lg:pt-[120px] px-4 sm:px-8 lg:px-[90px] flex flex-col xl:flex-row items-start xl:justify-between gap-8 xl:gap-10">
        {/* Left — title + meta + SDG tags */}
        <div className="flex flex-col gap-4 lg:gap-6 w-full xl:max-w-[1024px] animate-fade-in-up">
          <h1
            className="font-semibold text-black"
            style={{
              fontFamily: "Open Sans, sans-serif",
              fontSize: "clamp(2rem, 4.17vw, 5rem)",
              lineHeight: "110%",
            }}
          >
            {project.name}
          </h1>

          <div className="flex flex-col gap-3 lg:gap-4">
            <p
              style={{
                fontFamily: "Open Sans, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.9375rem, 1.25vw, 1.5rem)",
                lineHeight: "140%",
                color: "#151515",
              }}
            >
              {project.countriesCovered.join(", ")} &nbsp;·&nbsp; Led by{" "}
              {member?.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.focusSdgs.map((sdgId) => (
                <span
                  key={sdgId}
                  className="inline-block text-white transition-transform duration-200 hover:scale-105"
                  style={{
                    background: "#55B4F3",
                    borderRadius: "124px",
                    padding: "clamp(4px,0.42vw,8px) clamp(10px,1.04vw,20px)",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(0.75rem, 1.04vw, 1.25rem)",
                    lineHeight: "140%",
                  }}
                >
                  #SDG{sdgId}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — QR section (only shown at xl+; below xl stacks below title naturally) */}
        <QRSection value={qrValue} />
      </div>

      {/* ── Hero image ── */}
      <div className="mt-6 lg:mt-[74px] px-4 sm:px-8 lg:px-[90px] mb-8 lg:mb-[120px]">
        <div
          className="rounded-[20px] lg:rounded-[40px] overflow-hidden"
          style={{
            background: "#0068A5",
            height: "clamp(240px, 32.7vw, 628px)",
          }}
        >
          <Image
            src={project.outstandingImageUrl}
            alt={project.name}
            preview={false}
            className="w-full h-full object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            wrapperStyle={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        className="mx-auto w-full px-4 md:px-8 pb-10 lg:pb-[175px]"
        style={{ maxWidth: "1344px" }}
      >
        <div className="flex flex-col gap-10 lg:gap-[80px]">
          {/* Organization */}
          <div
            ref={orgRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "max-w-[746px] transition-all duration-700",
              orgVisible ? "animate-fade-in-up" : "opacity-0",
            )}
          >
            <div className="flex flex-col gap-4 lg:gap-6">
              <h2
                className="font-semibold text-black"
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  fontSize: "clamp(1.5rem, 2.29vw, 2.75rem)",
                  lineHeight: "140%",
                }}
              >
                Organization
              </h2>
              {member?.description && (
                <p
                  style={{
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.875rem, 1.04vw, 1.25rem)",
                    lineHeight: "150%",
                    color: "#000000",
                  }}
                >
                  {member.description}
                </p>
              )}
              {member?.socialLinks && member.socialLinks.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {member.socialLinks.map((link) => {
                    const iconName =
                      SOCIAL_ICON_MAP[link.platform.toLowerCase()];
                    if (!iconName) return null;
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-[#005D9A] transition-colors duration-200 hover:scale-110 transform"
                      >
                        <Icon name={iconName} size={24} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Gradient divider */}
          <Divider style={{ background: GRADIENT_DIVIDER, margin: 0 }} />

          {/* Project detail rows */}
          <div
            ref={detailRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "flex flex-col gap-4 lg:gap-6 transition-all duration-700",
              detailVisible ? "animate-fade-in-up" : "opacity-0",
            )}
          >
            <DetailRow label="Project name">
              <span style={VALUE_STYLE}>{project.name}</span>
            </DetailRow>

            <DetailRow label="Project Description" uploadLink>
              <span style={VALUE_STYLE}>{project.description}</span>
            </DetailRow>

            <DetailRow label="Indication of Impact" uploadLink>
              <span style={VALUE_STYLE}>{project.impactIndication}</span>
            </DetailRow>

            <DetailRow label="Region">
              <span style={VALUE_STYLE}>{project.region}</span>
            </DetailRow>

            <DetailRow label="Countries covered">
              <span style={VALUE_STYLE}>
                {project.countriesCovered.join(", ")}
              </span>
            </DetailRow>

            <DetailRow label="Focus SDGs">
              <div className="flex flex-wrap gap-2">
                {project.focusSdgs.map((sdgId) => (
                  <span
                    key={sdgId}
                    className="inline-block text-white"
                    style={{
                      background: "#55B4F3",
                      borderRadius: "124px",
                      padding: "6px 16px",
                      fontFamily: "Open Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "clamp(0.75rem, 1.04vw, 1.25rem)",
                    }}
                  >
                    #SDG{sdgId}
                  </span>
                ))}
              </div>
            </DetailRow>

            <DetailRow label="Status">
              <span style={VALUE_STYLE}>{project.status}</span>
            </DetailRow>

            <DetailRow label="Outstanding Project Image" uploadLink>
              <span style={{ ...VALUE_STYLE, color: "#EE334E" }}>
                Create new folder with format &ldquo;Project name_Project
                Image&rdquo;
              </span>
            </DetailRow>
          </div>

          {/* Other Projects */}
          <div
            ref={otherRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "flex flex-col gap-4 lg:gap-6 transition-all duration-700",
              otherVisible ? "animate-fade-in-up" : "opacity-0",
            )}
          >
            <h2
              className="font-semibold text-black"
              style={{
                fontFamily: "Open Sans, sans-serif",
                fontSize: "clamp(1.5rem, 2.29vw, 2.75rem)",
                lineHeight: "140%",
              }}
            >
              Other Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {otherProjects.map((p, index) => (
                <div
                  key={p.id}
                  className={cn(
                    otherVisible ? "animate-fade-in-up" : "opacity-0",
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <ProjectCard project={p} ledBy={MEMBER_MAP[p.memberId]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
