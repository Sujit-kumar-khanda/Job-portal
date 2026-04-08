import React from "react";
import { 
  User, 
  Briefcase, 
  Rocket, 
  Terminal, 
  Trash2, 
  Plus, 
  Hash, 
  FileText // Added for the Summary icon
} from "lucide-react";
import { SectionWrapper } from "../resumeSkeleton/SectionWrapper";
import { FormInput } from "../resumeSkeleton/FormInput";

const ResumeForm = ({ register, experience, projects, skills }) => {
  return (
    <div className="pb-32 space-y-12">
      
      {/* 1. PERSONAL INFORMATION */}
      <SectionWrapper title="Identity" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <FormInput label="Full Name" name="personal.name" register={register} placeholder="Om Prakash Nayak" />
          <FormInput label="Email Address" name="personal.email" register={register} placeholder="om@example.com" />
          <FormInput label="Professional Location" name="personal.location" register={register} placeholder="Rourkela, India" />
          <FormInput label="Contact Number" name="personal.phone" register={register} placeholder="+91 000..." />
        </div>
      </SectionWrapper>

      {/* ── NEW: PROFESSIONAL SUMMARY ── */}
      <SectionWrapper title="Summary" icon={FileText}>
        <div className="bg-indigo-50/30 p-1 rounded-[2rem] border border-indigo-100/50">
          <FormInput 
            label="Professional Overview" 
            name="summary" 
            register={register} 
            isTextArea 
            placeholder="e.g. Passionate Full Stack Developer with experience in MERN stack and Cloud technologies. Proven ability to build scalable web applications and optimize database performance..." 
          />
        </div>
      </SectionWrapper>

      {/* 2. WORK EXPERIENCE */}
      <SectionWrapper 
        title="Experience" 
        icon={Briefcase} 
        onAdd={() => experience.append({ company: "", role: "", dates: "", desc: "" })}
      >
        <div className="space-y-4">
          {experience.fields.map((field, index) => (
            <div key={field.id} className="group relative p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="absolute -left-3 top-8 w-1.5 h-8 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              
              <button 
                type="button"
                onClick={() => experience.remove(index)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors p-2 bg-slate-50 hover:bg-rose-50 rounded-xl"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormInput label="Company Name" name={`experience.${index}.company`} register={register} placeholder="e.g. Rooman Technologies" />
                <FormInput label="Timeline" name={`experience.${index}.dates`} register={register} placeholder="Jan 2024 — Present" />
              </div>
              <FormInput label="Job Title" name={`experience.${index}.role`} register={register} placeholder="Full Stack Developer Intern" />
              <FormInput label="Key Achievements" name={`experience.${index}.desc`} register={register} isTextArea placeholder="Describe your impact and the technologies you used..." />
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 3. PROJECTS */}
      <SectionWrapper 
        title="Projects" 
        icon={Rocket} 
        onAdd={() => projects.append({ name: "", tech: "", desc: "", link: "" })}
      >
        <div className="space-y-4">
          {projects.fields.map((field, index) => (
            <div key={field.id} className="group relative p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="absolute -left-3 top-8 w-1.5 h-8 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              
              <button 
                type="button"
                onClick={() => projects.remove(index)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors p-2 bg-slate-50 hover:bg-rose-50 rounded-xl"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormInput label="Project Name" name={`projects.${index}.name`} register={register} placeholder="e.g. AI Skill Gap Analytics" />
                <FormInput label="Tech Stack" name={`projects.${index}.tech`} register={register} placeholder="MERN, Docker, MySQL" />
              </div>
              <FormInput label="Project Link" name={`projects.${index}.link`} register={register} placeholder="github.com/your-repo" />
              <FormInput label="Problem Solved" name={`projects.${index}.desc`} register={register} isTextArea placeholder="What did you build and why does it matter?" />
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 4. SKILLS */}
      <SectionWrapper 
        title="Expertise" 
        icon={Terminal} 
        onAdd={() => skills.append({ name: "" })}
      >
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.fields.map((field, index) => (
              <div key={field.id} className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Hash size={14} />
                </div>
                <input
                  {...register(`skills.${index}.name`)}
                  placeholder="React.js"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium shadow-sm"
                />
                <button 
                  type="button"
                  onClick={() => skills.remove(index)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ResumeForm;