import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b flex items-center px-4 py-2" style={{ minHeight: 48 }}>
      {/* Logo */}
      <span className="text-xl font-bold text-[#21adae]">Scholaro</span>
      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center border border-[#21adae] rounded-md w-full max-w-2xl h-9 ml-4">
          <svg width="20" height="20" fill="none" className="mx-2 text-[#21adae]" stroke="currentColor" strokeWidth={2}>
            <circle cx="9" cy="9" r="7" />
            <line x1="15" y1="15" x2="19" y2="19" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full px-2 text-sm bg-transparent focus:outline-none text-[#21adae] placeholder-[#21adae]"
            style={{ minWidth: 200 }}
          />
        </div>
      </div>
      {/* Spacer */}
      <div className="flex items-center gap-7 ml-4">
        {/* Notification Icon */}
        <button className="focus:outline-none">
          <svg width="24" height="24" fill="none" className="text-[#21adae]" stroke="currentColor" strokeWidth={2}>
            <path d="M12 22s1-1 1-2h-2c0 1 1 2 1 2Z" />
            <path d="M6 8v5c0 1.886-.356 3.813-2 5h16c-1.644-1.187-2-3.114-2-5V8a6 6 0 1 0-12 0Z" />
          </svg>
        </button>
        {/* Profile Avatar */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" // replace with your profile img URL
          alt="profile"
          className="rounded-full w-9 h-9 object-cover border"
        />
      </div>
    </header>
  );
}
