import React from "react";
import { Briefcase, Users, ShieldCheck, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    desc: "Find jobs that perfectly match your skills, experience, and career goals."
  },
  {
    icon: Users,
    title: "Employer-Friendly Hiring",
    desc: "Employers can post jobs, manage applications, and hire talent effortlessly."
  },
  {
    icon: ShieldCheck,
    title: "Secure & Transparent",
    desc: "Verified users, secure authentication, and real-time application tracking."
  },
  {
    icon: Rocket,
    title: "Career Growth",
    desc: "Not just jobs — we help you build a successful long-term career."
  }
];

const About = () => {
  return (
    <section className="pt-24 pb-20 bg-linear-to-br from-indigo-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6">

        {/* SEO Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            About <span className="text-indigo-600">JobSeeker</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            JobSeeker is a modern job portal connecting talented professionals
            with trusted employers — faster, smarter, and more transparently.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Career, Simplified
            </h2>
            <p className="text-gray-700 leading-relaxed">
              JobSeeker was built to remove the confusion and frustration from
              hiring and job searching. Whether you’re a job seeker looking for
              the right opportunity or an employer searching for top talent,
              our platform provides everything you need in one place.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We focus on simplicity, transparency, and efficiency — so you can
              focus on what truly matters: your future.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
              alt="Team collaboration"
              className="rounded-2xl shadow-2xl max-w-md w-full"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <item.icon className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900">
            Ready to Shape Your Future?
          </h3>
          <p className="mt-2 text-gray-700">
            Join JobSeeker today and take the next step in your career journey.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
