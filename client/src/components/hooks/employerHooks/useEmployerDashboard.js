
import React, { useState, useEffect } from "react";

export const useEmployerDashboard = (api, user, loadingUser, toast) => {
    const SKILLS = [
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
    "sql",
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
    "tableau",
    "Power BI",
    "Data visualization",
    "Regression analysis",
    "java",
    "c++",
    "django",
    "spring boot",
  ];

  const [skillInput, setSkillInput] = useState(""); // for skill input field
  const [suggestions, setSuggestions] = useState([]); // for skill suggestions dropdown
  const [selectedSkills, setSelectedSkills] = useState([]); // for storing selected skills as an array of strings
  const [active, setActive] = useState("post"); // "post" or "myjobs"
  const [formData, setFormData] = useState({ // form data for posting a job
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
  });

  const [jobs, setJobs] = useState([]); // jobs posted by employer along with applicants
  const [loading, setLoading] = useState(false); // for post job button loading state

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async () => {
    if (!user || user.role !== "employer") return;
    try {
      const res = await api.get("/jobs/employer/applications");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  };

  useEffect(() => {
    if (!loadingUser && user?.role === "employer") {
      fetchJobs();
    }
  }, [loadingUser, user]);

  // skill input handler with suggestions
  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.length > 0) {
      const filtered = SKILLS.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // add skill to selected list
  const addSkill = (skill) => {
    const trimmed = skill.trim(); // remove extra spaces from both ends

    if (!trimmed) return; // ignore empty strings

    // check for duplicates (case-insensitive)
    setSelectedSkills((prev) => {
      // some() returns true if any skill in prev matches the new skill (ignoring case)
      const alreadyExists = prev.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase(),
      );

      if (alreadyExists) return prev; // if duplicate, return the original array without adding

      return [...prev, trimmed]; // add new skill if it's not a duplicate
    });

    setSkillInput("");
    setSuggestions([]);
  };

  // remove skill from selected list
  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  /* ================= POST JOB ================= */
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description)
      return toast.error("Title & description required");

    try {
      setLoading(true);
      await api.post("/jobs", {
        ...formData,
        skills: selectedSkills.map((s) => s.trim()).filter(Boolean),
      });

      toast.success("Job posted successfully");

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        skills: "",
      });

      setActive("myjobs");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS UPDATE ================= */
  const handleStatusChange = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Application ${status}`);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  



 return {
    // usestates
    skillInput, // current value of skill input field
    suggestions, // array of skill suggestions based on input
    selectedSkills, // array of skills selected for the job
    setSelectedSkills, // function to update selected skills
    active, // current active tab ("post" or "myjobs")
    setActive, // function to change active tab
    formData, // object containing form data for posting a job (title, description, location, salary, skills)
    setFormData, // function to update form data
    jobs, // array of jobs posted by the employer along with their applicants and application statuses
    loading, // boolean indicating if the post job request is in progress

    // handlers
    handleSkillChange, // updates skillInput and suggestions based on user input
    addSkill, // adds a skill to selectedSkills if it's not a duplicate
    removeSkill, // removes a skill from selectedSkills
    handlePostJob, // submits the job posting form
    handleStatusChange, // updates the status of a job application
 };
};
