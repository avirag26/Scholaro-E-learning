import React from "react";
export default function FeatureTabs() {
  const tabs = [
    { label: "Web Development", color: "bg-cyan-100 text-cyan-600" },
    { label: "User Experience", color: "bg-fuchsia-100 text-fuchsia-600" },
    { label: "Marketing", color: "bg-yellow-100 text-yellow-600" }
  ];
  return (
    <div className="flex gap-4 justify-center py-6 bg-gray-900">
      {tabs.map(tab => (
        <div key={tab.label} className={`px-5 py-2 rounded-md font-bold ${tab.color}`}>
          {tab.label}
        </div>
      ))}
    </div>
  );
}
