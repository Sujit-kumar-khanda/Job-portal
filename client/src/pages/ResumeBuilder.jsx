import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useResume } from "../components/hooks/resumebuilerHookes/useResume";
import ResumeForm from "../components/resumeSkeleton/ResumeForm";
import ResumePreview from "../components/resumeSkeleton/ResumePreview";
import { Download, Sparkles, Layout } from "lucide-react";

const BuilderPage = () => {
  const { register, experience, projects, skills, data } = useResume();
  const previewRef = useRef();

  // PDF Download Logic
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${data?.personal?.fullName || "Resume"}_ProResume`,
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F1F5F9] overflow-hidden font-sans">
      
      {/* ── LEFT COLUMN (EDITOR) ── */}
      <div className="w-full lg:w-[500px] xl:w-[600px] h-full overflow-y-auto bg-white border-r border-slate-200 no-scrollbar shadow-xl z-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              ProResume <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Editor Mode</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Auto-saving</span>
          </div>
        </div>
        
        <div className="p-8">
          <ResumeForm 
            register={register} 
            experience={experience} 
            projects={projects} 
            skills={skills} 
          />
        </div>
      </div>

      {/* ── RIGHT COLUMN (PREVIEW WORKSPACE) ── */}
      <div className="flex-1 relative flex flex-col bg-slate-100/50">
        
        {/* Floating Top Tool Bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4 px-4 text-white/70">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tight">Modern Template</span>
              </div>
            </div>

            <button 
              onClick={handlePrint}
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* The Paper Preview Canvas */}
        <div className="flex-1 overflow-auto pt-32 pb-20 px-8 no-scrollbar scroll-smooth">
          <div className="max-w-[850px] mx-auto transition-all duration-500 ease-in-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <ResumePreview data={data} ref={previewRef} />
          </div>
        </div>

        {/* Zoom/Page Indicator (Visual Polish) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                A4 Page View • 100%
            </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;