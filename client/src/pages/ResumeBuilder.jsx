import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaDownload,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaProjectDiagram,
} from "react-icons/fa";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const ResumeBuilder = () => {
  const [resume, setResume] = useState({
    personal: {
      name: "",
      email: "",
      phone: "",
      location: "Chennai, Tamil Nadu",
    },
    summary: "",
    experience: [{ company: "", role: "", dates: "", desc: "" }],
    education: [{ school: "", degree: "", dates: "" }],
    projects: [{ name: "", desc: "", tech: "", link: "" }],
    skills: [""],
  });
  const previewRef = useRef();

  const addSection = useCallback((type) => {
    setResume((prev) => {
      if (type === "experience") {
        return {
          ...prev,
          experience: [
            ...prev.experience,
            { company: "", role: "", dates: "", desc: "" },
          ],
        };
      } else if (type === "education") {
        return {
          ...prev,
          education: [...prev.education, { school: "", degree: "", dates: "" }],
        };
      } else if (type === "projects") {
        return {
          ...prev,
          projects: [
            ...prev.projects,
            { name: "", desc: "", tech: "", link: "" },
          ],
        };
      } else if (type === "skills") {
        return { ...prev, skills: [...prev.skills, ""] };
      }
      return prev;
    });
  }, []);

  const updateField = useCallback((section, index, field, value) => {
    setResume((prev) => {
      const newResume = { ...prev };
      if (section === "skills") {
        newResume.skills[index] = value;
      } else if (newResume[section] && newResume[section][index]) {
        newResume[section][index][field] = value;
      }
      return newResume;
    });
  }, []);

  const removeSection = useCallback((section, index) => {
    setResume((prev) => {
      const newResume = { ...prev };
      if (newResume[section] && newResume[section][index]) {
        newResume[section].splice(index, 1);
        if (newResume[section].length === 0) {
          if (section === "experience") {
            newResume[section] = [
              { company: "", role: "", dates: "", desc: "" },
            ];
          } else if (section === "education") {
            newResume[section] = [{ school: "", degree: "", dates: "" }];
          } else if (section === "projects") {
            newResume[section] = [{ name: "", desc: "", tech: "", link: "" }];
          } else if (section === "skills") {
            newResume[section] = [""];
          }
        }
      }
      return newResume;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nameInput = document.querySelector(
        'input[placeholder="Full Name"]',
      );
      if (nameInput) nameInput.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const downloadPDF = useCallback(async () => {
    const element = previewRef.current;
    if (!element || !(element instanceof HTMLElement)) {
      alert("Preview not ready. Please wait and try again.");
      return;
    }

    try {
      // Temporarily optimize for PDF capture
      const originalStyles = {
        border: element.style.border,
        boxShadow: element.style.boxShadow,
        padding: element.style.padding,
      };

      element.style.border = "none";
      element.style.boxShadow = "none";
      element.style.padding = "24px";
      element.style.margin = "0";

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 595,
        height: 842,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 595,
        windowHeight: 842,
        allowTaint: true,
      });

      // Restore styles
      Object.entries(originalStyles).forEach(([key, value]) => {
        element.style[key] = value;
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      let imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Scale to fit A4 perfectly
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight * 0.95;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `${resume.personal.name.trim() || "resume"}-${timestamp}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  }, [resume.personal.name]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional resumes that fit perfectly on A4. Instant PDF
            export.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Editor */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 sticky top-8 max-h-screen overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <FaEdit className="mr-3 text-blue-500" /> Edit Resume
            </h2>

            {/* Personal Info */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-4">Personal Info</h3>
              <input
                className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
                value={resume.personal.name}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    personal: { ...resume.personal, name: e.target.value },
                  })
                }
              />
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  value={resume.personal.email}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personal: { ...resume.personal, email: e.target.value },
                    })
                  }
                />
                <input
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone"
                  value={resume.personal.phone}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personal: { ...resume.personal, phone: e.target.value },
                    })
                  }
                />
              </div>
              <input
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
                value={resume.personal.location}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    personal: { ...resume.personal, location: e.target.value },
                  })
                }
              />
            </section>

            {/* Summary */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-4">
                Professional Summary
              </h3>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Tell us about your experience and goals (keep concise)..."
                value={resume.summary}
                onChange={(e) =>
                  setResume({ ...resume, summary: e.target.value })
                }
              />
            </section>

            {/* Experience - Compact */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Experience</h3>
                <button
                  onClick={() => addSection("experience")}
                  className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-3 mb-2">
                    <input
                      className="p-3 border rounded-lg text-sm"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateField(
                          "experience",
                          idx,
                          "company",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      className="p-3 border rounded-lg text-sm"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) =>
                        updateField("experience", idx, "role", e.target.value)
                      }
                    />
                  </div>
                  <input
                    className="w-full p-3 border rounded-lg mb-2 text-sm"
                    placeholder="Dates (2020-Present)"
                    value={exp.dates}
                    onChange={(e) =>
                      updateField("experience", idx, "dates", e.target.value)
                    }
                  />
                  <textarea
                    className="w-full p-3 border rounded-lg h-16 text-sm"
                    placeholder="Key achievements (3-4 bullet points)"
                    value={exp.desc}
                    onChange={(e) =>
                      updateField("experience", idx, "desc", e.target.value)
                    }
                  />
                  {resume.experience.length > 1 && (
                    <button
                      onClick={() => removeSection("experience", idx)}
                      className="text-red-500 hover:text-red-700 mt-2 flex items-center text-sm"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </section>

            {/* Projects - Compact */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold flex items-center">
                  <FaProjectDiagram className="mr-2 text-orange-500" /> Projects
                </h3>
                <button
                  onClick={() => addSection("projects")}
                  className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              {resume.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-100"
                >
                  <input
                    className="w-full p-3 border rounded-lg mb-2 text-sm"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) =>
                      updateField("projects", idx, "name", e.target.value)
                    }
                  />
                  <textarea
                    className="w-full p-3 border rounded-lg mb-3 h-16 text-sm"
                    placeholder="What you built + impact (keep short)"
                    value={project.desc}
                    onChange={(e) =>
                      updateField("projects", idx, "desc", e.target.value)
                    }
                  />
                  <div className="grid md:grid-cols-2 gap-3 mb-2">
                    <input
                      className="p-3 border rounded-lg text-sm"
                      placeholder="Tech Stack"
                      value={project.tech}
                      onChange={(e) =>
                        updateField("projects", idx, "tech", e.target.value)
                      }
                    />
                    <input
                      className="p-3 border rounded-lg text-sm"
                      placeholder="Live Link"
                      value={project.link}
                      onChange={(e) =>
                        updateField("projects", idx, "link", e.target.value)
                      }
                    />
                  </div>
                  {resume.projects.length > 1 && (
                    <button
                      onClick={() => removeSection("projects", idx)}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </section>

            {/* Education - Compact */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Education</h3>
                <button
                  onClick={() => addSection("education")}
                  className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              {resume.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl mb-4"
                >
                  <input
                    className="p-3 border rounded-lg text-sm"
                    placeholder="University/College"
                    value={edu.school}
                    onChange={(e) =>
                      updateField("education", idx, "school", e.target.value)
                    }
                  />
                  <input
                    className="p-3 border rounded-lg text-sm"
                    placeholder="Degree, CGPA"
                    value={edu.degree}
                    onChange={(e) =>
                      updateField("education", idx, "degree", e.target.value)
                    }
                  />
                  <input
                    className="w-full md:w-32 p-3 border rounded-lg text-sm"
                    placeholder="2020-2024"
                    value={edu.dates}
                    onChange={(e) =>
                      updateField("education", idx, "dates", e.target.value)
                    }
                  />
                  {resume.education.length > 1 && (
                    <button
                      onClick={() => removeSection("education", idx)}
                      className="text-red-500 self-start p-2 hover:text-red-700 text-sm"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </section>

            {/* Skills - Compact */}
            <section className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Skills</h3>
                <button
                  onClick={() => addSection("skills")}
                  className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all flex items-center"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              <div className="space-y-3 max-w-md">
                {resume.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <input
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                      placeholder="React, Node.js, Python..."
                      value={skill}
                      onChange={(e) =>
                        updateField("skills", idx, "skill", e.target.value)
                      }
                    />
                    {resume.skills.length > 1 && (
                      <button
                        onClick={() => removeSection("skills", idx)}
                        className="p-3 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all flex items-center shadow-sm hover:shadow-md"
                        title="Remove skill"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <button
              onClick={downloadPDF}
              disabled={!resume.personal.name.trim()}
              className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-6 rounded-2xl text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              <FaFilePdf className="mr-3" /> Download A4 PDF (Perfect Fit)
            </button>
          </div>

          {/* A4 Preview - PERFECTLY OPTIMIZED FOR SINGLE PAGE */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 lg:p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center">
              <FaDownload className="mr-3 text-green-500" /> A4 Preview
            </h2>
            <div
              ref={previewRef}
              data-testid="resume-preview"
              className="bg-white p-4 rounded-2xl border-4 border-gray-200 shadow-2xl print:border-none"
              style={{
                width: "595px", // EXACT A4 width
                height: "842px", // EXACT A4 height
                margin: "0 auto",
                boxSizing: "border-box",
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                fontSize: "14px",
                lineHeight: "1.4",
                overflow: "hidden",
                padding: "24px",
              }}
            >
              {/* Header */}
              <div className="text-center border-b pb-2 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-1 leading-tight">
                  {resume.personal.name || "Your Name"}
                </h1>
                <p className="text-gray-600 text-sm leading-tight">
                  {resume.personal.email || "email@example.com"} •{" "}
                  {resume.personal.phone || "phone"} •{" "}
                  {resume.personal.location}
                </p>
              </div>

              {/* Summary - Compact */}
              {resume.summary.trim() && (
                <section className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 uppercase tracking-wide">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {resume.summary}
                  </p>
                </section>
              )}

              {/* Projects - Compact */}
              {resume.projects.some((proj) => proj.name.trim()) && (
                <section className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 uppercase tracking-wide">
                    Projects
                  </h2>
                  {resume.projects.map((proj, idx) =>
                    proj.name.trim() ? (
                      <div key={idx} className="mb-3">
                        <h3 className="font-semibold text-gray-800 text-base mb-1 leading-tight">
                          {proj.name}
                        </h3>
                        <p className="text-orange-600 font-medium mb-1 text-xs">
                          {proj.tech.trim()}
                          {proj.link.trim() && (
                            <>
                              {" • "}
                              <a
                                href={proj.link}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View →
                              </a>
                            </>
                          )}
                        </p>
                        <p className="text-gray-700 text-xs leading-tight">
                          {proj.desc}
                        </p>
                      </div>
                    ) : null,
                  )}
                </section>
              )}

              {/* Experience - Compact */}
              {resume.experience.some((exp) => exp.company.trim()) && (
                <section className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 uppercase tracking-wide">
                    Experience
                  </h2>
                  {resume.experience.map((exp, idx) =>
                    exp.company.trim() ? (
                      <div key={idx} className="mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                          {exp.role.trim()}{" "}
                          <span className="font-normal">@ {exp.company}</span>
                        </h3>
                        <p className="text-blue-600 font-medium text-xs mb-1">
                          {exp.dates.trim()}
                        </p>
                        <p className="text-gray-700 text-xs leading-tight">
                          {exp.desc}
                        </p>
                      </div>
                    ) : null,
                  )}
                </section>
              )}

              {/* Education - Compact */}
              {resume.education.some((edu) => edu.school.trim()) && (
                <section className="mb-2">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 uppercase tracking-wide">
                    Education
                  </h2>
                  {resume.education.map((edu, idx) =>
                    edu.school.trim() ? (
                      <div key={idx} className="mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                          {edu.degree.trim()}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {edu.school.trim()} • {edu.dates.trim()}
                        </p>
                      </div>
                    ) : null,
                  )}
                </section>
              )}

              {/* Skills - Compact Grid */}
              {resume.skills.some((skill) => skill.trim()) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 uppercase tracking-wide">
                    Skills
                  </h2>
                  <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-7 grid-rows-3 gap-1 pt-1">
                    {resume.skills.map((skill, idx) =>
                      skill.trim() ? (
                        <div
                          key={idx}
                          className="    font-medium text-xs text-center "
                        >
                          {skill.trim()}
                        </div>
                      ) : null,
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
