import React, { useRef, useEffect, useState } from "react";

const A4_WIDTH_PX = 794; 
const A4_HEIGHT_PX = 1123; 

const ResumePreview = React.forwardRef(({ data }, ref) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const available = el.offsetWidth - 48;
      setScale(Math.min(1, available / A4_WIDTH_PX));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const renderBullets = (text) => {
    if (!text) return null;
    return text.split("\n").filter((l) => l.trim()).map((line, i) => (
      <li key={i} className="mb-0.5 ml-5 list-disc text-justify leading-tight">
        {line.trim()}
      </li>
    ));
  };

  return (
    <div ref={containerRef} className="w-full overflow-hidden flex flex-col items-center justify-start min-h-screen bg-slate-200/40 py-10">
      
      {/* Container with sharp shadow for a professional document look */}
      <div
        style={{
          width: A4_WIDTH_PX * scale,
          height: A4_HEIGHT_PX * scale,
          position: "relative",
          flexShrink: 0,
        }}
        className="shadow-2xl"
      >
        <div
          ref={ref}
          className="bg-white text-black absolute top-0 left-0 origin-top-left"
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            padding: "15mm 15mm", 
            boxSizing: "border-box",
            transform: `scale(${scale})`,
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          {/* ── 1. CENTERED HEADER ── */}
          <div className="text-center mb-5">
            <h1 className="text-[22pt] font-bold uppercase mb-1 leading-none tracking-tight">
              {data.personal?.name || "YOUR NAME"}
            </h1>
            <div className="text-[10pt] flex justify-center gap-1.5 flex-wrap items-center">
              <span>{data.personal?.location || "City, State"}</span>
              <span>•</span>
              <span className="underline decoration-1 underline-offset-2">
                {data.personal?.email || "email@address.com"}
              </span>
              <span>•</span>
              <span>{data.personal?.phone || "000-000-0000"}</span>
            </div>
          </div>

          {/* ── 2. NEW: PROFESSIONAL SUMMARY ── */}
          {data.summary && (
            <div className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1.5 tracking-tight">
                Professional Summary
              </h2>
              <p className="text-[10pt] text-justify leading-snug">
                {data.summary}
              </p>
            </div>
          )}

          {/* ── 3. EDUCATION ── */}
          <div className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1.5 tracking-tight">
              Education
            </h2>
            <div className="flex justify-between items-baseline font-bold text-[10.5pt]">
              <span>College of Engineering Bhubaneswar (COEB)</span>
              <span>May 2026</span>
            </div>
            <div className="flex justify-between items-baseline italic text-[10pt]">
              <span>Bachelor of Technology in Computer Science</span>
              <span>Bhubaneswar, India</span>
            </div>
          </div>

          {/* ── 4. EXPERIENCE ── */}
          <div className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">
              Work Experience
            </h2>
            {data.experience?.map((exp, i) => exp.company && (
              <div key={i} className="mb-3.5 last:mb-0">
                <div className="flex justify-between items-baseline font-bold text-[10.5pt]">
                  <span>{exp.company}</span>
                  <span>{exp.dates}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-[10pt] mb-1">
                  <span>{exp.role}</span>
                  <span>{data.personal?.location}</span>
                </div>
                <ul className="text-[10pt] space-y-0.5">
                  {renderBullets(exp.desc)}
                </ul>
              </div>
            ))}
          </div>

          {/* ── 5. PROJECTS ── */}
          {data.projects?.[0]?.name && (
            <div className="mb-4">
              <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">
                Projects
              </h2>
              {data.projects.map((proj, i) => proj.name && (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10.5pt]">
                      {proj.name} | <span className="italic font-normal">{proj.tech}</span>
                    </span>
                    {proj.link && <span className="text-[9pt] underline">{proj.link}</span>}
                  </div>
                  <ul className="text-[10pt] mt-0.5">
                    {renderBullets(proj.desc)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ── 6. SKILLS ── */}
          <div className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1.5 tracking-tight">
              Technical Skills
            </h2>
            <div className="text-[10pt] leading-tight">
              <span className="font-bold">Expertise: </span>
              {data.skills?.map((s) => s.name).filter(Boolean).join(", ") || "MERN Stack, MySQL, Docker"}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;