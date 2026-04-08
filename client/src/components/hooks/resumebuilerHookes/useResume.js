import { useForm, useFieldArray } from "react-hook-form";

export const useResume = () => {
  const { register, control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      personal: { name: "", email: "", phone: "", location: "Rourkela" },
      summary: "",
      experience: [{ company: "", role: "", dates: "", desc: "" }],
      projects: [{ name: "", tech: "", desc: "", link: "" }],
      skills: [{ name: "" }],
    },
  });

  // Dynamic field helpers
  const experience = useFieldArray({ control, name: "experience" });
  const projects = useFieldArray({ control, name: "projects" });
  const skills = useFieldArray({ control, name: "skills" });

  const data = watch(); // Live data for the preview

  return { register, control, data, experience, projects, skills, setValue };
};