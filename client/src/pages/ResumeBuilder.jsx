import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaPlus, FaDownload, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const defaultResume = {
  personal: { name: "", email: "", role: "", phone: "", location: "" },
  summary: "",
  education: [{ school: "", degree: "", dates: "" }],
  skills: [""],
  projects: [{ name: "", desc: "", tech: "", link: "" }],
  experience: [{ company: "", role: "", dates: "", desc: "" }],
};

const ResumeBuilder = () => {
  const [resume, setResume] = useState(defaultResume);
  const previewRef = useRef();

  const Section = ({ title, children }) => (
    <div className="mt-4 mb-4">
      <h2 className="text-[18px] font-bold uppercase tracking-widest  border-b border-gray-500 pb-1">
        {title}
      </h2>
      <div className="text-[14px] text-gray-800 mt-2">{children}</div>
    </div>
  );

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) setResume(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("resumeData", JSON.stringify(resume));
    }, 300);
    return () => clearTimeout(timeout);
  }, [resume]);

  const updatePersonal = useCallback((field, value) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  }, []);

  const updateField = useCallback((section, index, field, value) => {
    setResume((prev) => {
      const updated = [...prev[section]];
      updated[index] =
        section === "skills" ? value : { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  }, []);

  const addSection = useCallback((type) => {
    const map = {
      education: { school: "", degree: "", dates: "" },
      projects: { name: "", desc: "", tech: "", link: "" },
      experience: { company: "", role: "", dates: "", desc: "" },
      skills: "",
    };

    setResume((prev) => ({
      ...prev,
      [type]: [...prev[type], map[type]],
    }));
  }, []);

  const removeSection = useCallback((section, index) => {
    setResume((prev) => {
      const filtered = prev[section].filter((_, i) => i !== index);

      const fallback = {
        education: [{ school: "", degree: "", dates: "" }],
        projects: [{ name: "", desc: "", tech: "", link: "" }],
        experience: [{ company: "", role: "", dates: "", desc: "" }],
        skills: [""],
      };

      return {
        ...prev,
        [section]: filtered.length ? filtered : fallback[section],
      };
    });
  }, []);

  const downloadPDF = async () => {
    const element = previewRef.current;
    if (!element) return;
     element.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    element.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="grid lg:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2 mb-5">
            <FaEdit /> Edit Resume
          </h2>

          {["name", "role", "email", "phone", "location"].map((field) => (
            <input
              key={field}
              className="w-full mb-3 p-3 rounded-xl bg-black/30 border border-white/10 focus:border-indigo-500 outline-none text-sm"
              placeholder={field}
              value={resume.personal[field]}
              onChange={(e) => updatePersonal(field, e.target.value)}
            />
          ))}

          <textarea
            className="w-full mb-4 p-3 rounded-xl bg-black/30 border border-white/10 text-sm"
            placeholder="Summary"
            value={resume.summary}
            onChange={(e) =>
              setResume((prev) => ({ ...prev, summary: e.target.value }))
            }
          />

          {["education", "projects", "experience"].map((section) => (
            <div key={section} className="mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold capitalize text-indigo-300">
                  {section}
                </h3>

                <button
                  onClick={() => addSection(section)}
                  className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <FaPlus />
                </button>
              </div>

              {resume[section].map((item, i) => (
                <div
                  key={i}
                  className="mt-3 p-3 rounded-xl bg-black/20 border border-white/10"
                >
                  {Object.keys(item).map((field) => (
                    <input
                      key={field}
                      className="w-full mb-2 p-2 rounded-lg bg-black/30 border border-white/10 text-sm"
                      placeholder={field}
                      value={item[field]}
                      onChange={(e) =>
                        updateField(section, i, field, e.target.value)
                      }
                    />
                  ))}

                  <button
                    onClick={() => removeSection(section, i)}
                    className="text-red-400 text-sm mt-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          ))}

          {/* SKILLS */}
          <h3 className="mt-5 font-semibold text-indigo-300">Skills</h3>

          {resume.skills.map((skill, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input
                className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10 text-sm"
                value={skill}
                onChange={(e) =>
                  updateField("skills", i, "value", e.target.value)
                }
              />
              <button
                onClick={() => removeSection("skills", i)}
                className="text-red-400"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            onClick={() => addSection("skills")}
            className="mt-3 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <FaPlus />
          </button>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-indigo-600 rounded-xl flex items-center gap-2 text-sm"
            >
              <FaFilePdf /> Download
            </button>

            <button
              onClick={() => setResume(defaultResume)}
              className="px-4 py-2 bg-white/10 rounded-xl text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="bg-white rounded-2xl shadow-xl p-4 h-[90vh] overflow-y-auto text-black pdf-mode">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 flex items-center gap-2">
            <FaDownload /> Preview
          </h2>

          <div
            ref={previewRef}
            className="bg-white mx-auto"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "15mm",
            }}
          >

            {/* HEADER */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold uppercase">
                {resume.personal.name || "YOUR NAME"}
              </h1>
              <p className="text-[18px] text-gray-700">{resume.personal.role}</p>

              <div className="flex justify-center flex-wrap gap-3 text-[14px] text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {resume.personal.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {resume.personal.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {resume.personal.location}
                </span>
              </div>
            </div>

            {/* SUMMARY */}
            {resume.summary && (
              <Section title="Summary">{resume.summary}</Section>
            )}

            {/* EDUCATION */}
            {resume.education.some((e) => e.school || e.degree) && (
              <Section title="Education">
                {resume.education.map((edu, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm">
                        {edu.school}
                      </span>
                      <span className="text-xs text-gray-500">
                        {edu.dates}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">{edu.degree}</p>
                  </div>
                ))}
              </Section>
            )}

            {/* SKILLS */}
            {resume.skills.some((s) => s.trim()) && (
  <Section title="Skills">
    <div className="flex flex-wrap gap-1">
      {resume.skills.filter(Boolean).map((skill, i) => (
        <span
          key={i}
          className="px-2 py-1 bg-gray-200 rounded-full text-xs"
        >
          {skill}
        </span>
      ))}
    </div>

    {/* PDF GRID VERSION (hidden on screen, visible in PDF only) */}
    <div className="hidden print:block mt-2">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-xs">
        {resume.skills.filter(Boolean).map((skill, i) => (
          <div key={i} className="border-b border-gray-300 pb-1">
            {skill}
          </div>
        ))}
      </div>
    </div>
  </Section>
)}

            {/* PROJECTS */}
            {resume.projects.some((p) => p.name) && (
              <Section title="Projects">
                {resume.projects.map((p, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-semibold text-sm">
                      {p.name}
                      <span className="text-gray-500 ml-2 text-xs">
                        {p.tech}
                      </span>
                    </p>
                    <p className="text-xs text-gray-700">{p.desc}</p>
                  </div>
                ))}
              </Section>
            )}

            {/* EXPERIENCE */}
            {resume.experience.some((e) => e.company || e.role) && (
              <Section title="Experience">
                {resume.experience.map((e, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-semibold text-sm">
                      {e.role} @ {e.company}
                    </p>
                    <p className="text-xs text-gray-500">{e.dates}</p>
                    <p className="text-xs text-gray-700">{e.desc}</p>
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ResumeBuilder;