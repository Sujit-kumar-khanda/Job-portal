import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
export const useEmployerDashboard = (api, user, loadingUser) => {
  const SKILLS = useMemo(
    () => [
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Redux",
      "TypeScript",
      "Next.js",
      "Python",
      "Django",
      "Java",
      "Spring Boot",
      "SQL",
      "MySQL",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "Agile Methodologies",
      "Problem Solving",
      "R",
      "Tableau",
      "Power BI",
      "Data Visualization",
      "Regression Analysis",
      "C++",
    ],
    []
  );

  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [active, setActive] = useState("post");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH JOBS =================
  const fetchJobs = useCallback(async () => {
    if (!user || user.role !== "employer") return;

    try {
      const res = await api.get("/jobs/employer/applications");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch applications");
    }
  }, [api, user, toast]);

  useEffect(() => {
    if (!loadingUser && user?.role === "employer") {
      fetchJobs();
    }
  }, [loadingUser, user, fetchJobs]);

  // ================= SKILLS =================
  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.trim()) {
      const filtered = SKILLS.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    setSelectedSkills((prev) => {
      const exists = prev.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      );
      return exists ? prev : [...prev, trimmed];
    });

    setSkillInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  // ================= POST JOB =================
  const handlePostJob = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      return toast.error("Title & description required");
    }

    try {
      setLoading(true);

      await api.post("/jobs", {
        ...formData,
        skills: selectedSkills,
      });

      toast.success("Job posted successfully");

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        skills: "",
      });

      setSelectedSkills([]);
      setSkillInput("");
      setSuggestions([]);
      setActive("myjobs");

      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });

      toast.success(`Application ${status}`);

      // OPTIONAL OPTIMIZED UPDATE (instead of refetch)
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.applicationId === appId ? { ...app, status } : app
          ),
        }))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return {
    skillInput,
    suggestions,
    selectedSkills,
    setSelectedSkills,
    active,
    setActive,
    formData,
    setFormData,
    jobs,
    loading,

    handleSkillChange,
    addSkill,
    removeSkill,
    handlePostJob,
    handleStatusChange,
    fetchJobs,
  };
};