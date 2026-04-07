import React from "react";
import { PlusCircle, List } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "post-job", label: "Post Job", icon: <PlusCircle className="w-5 h-5" /> },
    { key: "my-jobs", label: "My Jobs", icon: <List className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg rounded-tr-2xl rounded-br-2xl p-6 flex flex-col gap-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Employer Dashboard</h2>

      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all w-full ${
            activeTab === tab.key
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-700 hover:bg-indigo-50"
          }`}
        >
          {tab.icon} <span>{tab.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
