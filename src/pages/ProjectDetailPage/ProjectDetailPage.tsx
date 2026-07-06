import { useParams } from 'react-router-dom';
import { Divider, Image } from "antd";
import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/common/ProjectCard";
import { SupportCTA } from "@/components/common/SupportCTA";
import { useSupportModal } from "@/components/common/SupportModal";
import { SDGTag } from "@/components/ui/SDGTag";
import { Container } from "@/components/ui/Container";
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

interface DetailRowProps {
  label: string;
  uploadLink?: boolean;
  children: React.ReactNode;
}

function DetailRow({ label, uploadLink, children }: DetailRowProps) {
  return (
    <div className="flex items-start w-full gap-2">
      <div className="flex-shrink-0 w-[120px] sm:w-[140px] lg:w-[220px] xl:w-[300px]">
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
  const { openSupport } = useSupportModal();

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

  return (
    <div>
      {/* ── Hero: title (left) + QR section (right) ── */}
      <Container>
        <div className="pt-10 lg:pt-[120px] flex flex-col md:flex-row md:items-start md:justify-between gap-4 lg:gap-8 xl:gap-10">
        {/* Left — title + meta + SDG tags */}
        <div className="flex flex-col gap-4 lg:gap-6 min-w-0 flex-1 xl:max-w-[1024px] animate-fade-in-up">
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
                <SDGTag
                  key={sdgId}
                  sdgId={sdgId}
                  variant="solid"
                  size="md"
                  className="!rounded-[6px] transition-transform duration-200 hover:scale-105"
                  style={{
                    padding: "clamp(6px,0.5vw,10px) clamp(12px,1.25vw,24px)",
                    fontSize: "clamp(0.75rem, 1.04vw, 1.25rem)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right — Support CTA (below xl stacks below title naturally) */}
        <SupportCTA onClick={openSupport} />
        </div>
      </Container>

      {/* ── Hero image ── */}
      <Container className="mt-6 lg:mt-[74px] mb-8 lg:mb-[120px]">
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
      </Container>

      {/* ── Main content ── */}
      <Container className="pb-10 lg:pb-[175px]">
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
                  <SDGTag
                    key={sdgId}
                    sdgId={sdgId}
                    variant="solid"
                    size="md"
                    className="!rounded-[6px] !py-1.5 !px-4"
                  />
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
      </Container>
    </div>
  );
}
