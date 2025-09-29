import React, { useState } from "react";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

const profileImg = "https://randomuser.me/api/portraits/men/32.jpg";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear auth state and local storage
        setAuth({});
        localStorage.removeItem("authToken");

        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/user/login", { replace: true }));
      }
    });
  };

  const [fields, setFields] = useState({
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com"
  });
  const [edit, setEdit] = useState({ name: false, phone: false, email: false });
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="w-full bg-white border-b flex items-center px-4 py-2" style={{ minHeight: 48 }}>
        <span className="text-xl font-bold text-[#21adae]">Scholaro</span>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center border border-[#21adae] rounded-md w-full max-w-2xl h-9 ml-4">
            <svg width="20" height="20" fill="none" className="mx-2 text-[#21adae]" stroke="currentColor" strokeWidth={2}>
              <circle cx="9" cy="9" r="7" />
              <line x1="15" y1="15" x2="19" y2="19" />
            </svg>
            <input
              type="text"
              placeholder="Search courses"
              className="w-full h-full px-2 text-sm bg-transparent focus:outline-none text-[#21adae] placeholder-[#21adae]"
              style={{ minWidth: 200 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-5 ml-4">
          <svg width="24" height="24" fill="none" className="text-[#21adae]" stroke="currentColor" strokeWidth={2}>
            <path d="M12 22s1-1 1-2h-2c0 1 1 2 1 2Z" />
            <path d="M6 8v5c0 1.886-.356 3.813-2 5h16c-1.644-1.187-2-3.114-2-5V8a6 6 0 1 0-12 0Z" />
          </svg>
          <img src={profileImg} className="w-8 h-8 rounded-full object-cover border" alt="profile" />
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white mx-6 mt-6 rounded-2xl shadow flex flex-col items-center py-8">
          <img src={profileImg} className="w-24 h-24 rounded-full shadow" alt="profile" />
          <div className="mt-4 text-[#21adae] font-semibold text-lg">{fields.name}</div>
          <button className="mt-2 px-4 py-1 bg-[#eafaf5] rounded-full text-[#1fbab8] text-sm border flex items-center gap-1 hover:bg-[#def6f0] transition">
            Share Profile
          </button>
          <ul className="w-full mt-6 text-gray-700">
            <li className="flex items-center px-8 py-2 bg-[#21adae]/90 text-white rounded-l-full font-semibold mb-1">Profile</li>
            <li className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer mb-1">My Courses</li>
            <li className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer mb-1">Teachers</li>
            <li className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer mb-1">My Orders</li>
            <li className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer mb-1">Wishlist</li>
            <li className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer mb-1">Certificates</li>
            <li onClick={handleLogout} className="flex items-center px-8 py-2 hover:bg-[#eafaf5] rounded-l-full cursor-pointer">
              <FiLogOut className="mr-3" /> Logout
            </li>
          </ul>
        </aside>
        {/* Profile Center */}
        <div className="flex-1 px-4 py-8">
          {/* Edit Profile Form */}
          <div className="border rounded-lg p-8 max-w-2xl mx-auto mb-8">
            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex items-center gap-2">
                <div className="w-32 font-semibold">Name</div>
                <input
                  type="text"
                  className="flex-1 border border-[#21adae] rounded px-3 py-2"
                  value={fields.name}
                  disabled={!edit.name}
                  onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                />
                <button
                  className="ml-2 p-2 rounded-full bg-[#eafaf5] hover:bg-[#def6f0] transition"
                  onClick={() => setEdit(e => ({ ...e, name: !e.name }))}
                  type="button"
                >
                  <FiEdit2 className="text-[#21adae] text-lg" />
                </button>
              </div>
              {/* Phone Field */}
              <div className="flex items-center gap-2">
                <div className="w-32 font-semibold">Phone</div>
                <input
                  type="text"
                  className="flex-1 border border-[#21adae] rounded px-3 py-2"
                  value={fields.phone}
                  disabled={!edit.phone}
                  onChange={e => setFields(f => ({ ...f, phone: e.target.value }))}
                />
                <button
                  className="ml-2 p-2 rounded-full bg-[#eafaf5] hover:bg-[#def6f0] transition"
                  onClick={() => setEdit(e => ({ ...e, phone: !e.phone }))}
                  type="button"
                >
                  <FiEdit2 className="text-[#21adae] text-lg" />
                </button>
              </div>
              {/* Email Field */}
              <div className="flex items-center gap-2">
                <div className="w-32 font-semibold">Email</div>
                <input
                  type="email"
                  className="flex-1 border border-[#21adae] rounded px-3 py-2"
                  value={fields.email}
                  disabled={!edit.email}
                  onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
                />
                <button
                  className="ml-2 p-2 rounded-full bg-[#eafaf5] hover:bg-[#def6f0] transition"
                  onClick={() => setEdit(e => ({ ...e, email: !e.email }))}
                  type="button"
                >
                  <FiEdit2 className="text-[#21adae] text-lg" />
                </button>
              </div>
              <button className="mt-8 px-7 py-2 rounded bg-[#21adae] text-white font-semibold w-fit">Submit</button>
            </div>
          </div>
          {/* Image preview/upload */}
          <div className="border rounded-lg p-8 max-w-2xl mx-auto">
            <div className="font-semibold mb-2">Image Preview</div>
            <div className="bg-[#eafaf5] rounded-lg flex items-center justify-center h-44 mb-4" style={{ border: "2px solid #f3f3f3" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full rounded-lg" />
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="18" height="12" x="3" y="6" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M21 18l-5-5-4 4-2-2-5 5" />
                </svg>
              )}
            </div>
            <button className="mb-4 px-6 py-2 rounded bg-[#21adae] text-white font-semibold">Save Image</button>
            <div>
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <label htmlFor="profile-photo">
                <div className="border border-[#21adae] rounded px-7 py-2 text-[#21adae] bg-white font-semibold text-center cursor-pointer w-fit mx-auto">Upload</div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
