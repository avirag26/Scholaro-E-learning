import React from "react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-bold text-xl mb-2">EduSphere</div>
          <div className="text-gray-400 text-sm">Empowering learners worldwide with quality education.</div>
        </div>
        <div>
          <div className="font-semibold mb-1">Quick Links</div>
          {["Home", "Features", "Benefits", "Courses"].map(link => (
            <a key={link} href="#" className="block text-gray-400 hover:text-cyan-400">{link}</a>
          ))}
        </div>
        <div>
          <div className="font-semibold mb-1">Support</div>
          {["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"].map(link => (
            <a key={link} href="#" className="block text-gray-400 hover:text-cyan-400">{link}</a>
          ))}
        </div>
        <div>
          <div className="font-semibold mb-1">Contact</div>
          <div className="text-gray-400 text-sm">info@edusphere.com<br /> (123) 456-7890<br /> 123 Education St.</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-600 mt-8">© 2025 EduSphere. All rights reserved.</div>
    </footer>
  );
}
