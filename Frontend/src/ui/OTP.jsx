import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { toast, Toaster } from "sonner";
import { axiosPublic } from "../api/axios";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion for animation

const OtpModal = ({ isOpen, onClose, onVerify, email }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
      const storedExpiryTime = localStorage.getItem(`otpExpiryTime_${email}`);

      if (storedExpiryTime) {
        const expiryTime = parseInt(storedExpiryTime);
        const currentTime = new Date().getTime();
        const remainingTime = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
        if (remainingTime > 0) setTimer(remainingTime);
        else {
          setTimer(0);
          localStorage.removeItem(`otpExpiryTime_${email}`);
        }
      } else {
        const newExpiryTime = new Date().getTime() + 60 * 1000;
        localStorage.setItem(`otpExpiryTime_${email}`, newExpiryTime.toString());
        setTimer(60);
      }
      setOtp(Array(6).fill(""));
    }
  }, [isOpen, email]);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            localStorage.removeItem(`otpExpiryTime_${email}`);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer, email]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (isResending || timer > 0) return;
    try {
      setIsResending(true);
      const response = await axiosPublic.post(`/api/users/resend-otp`, { email });
      if (response.status === 200) {
        const newExpiryTime = new Date().getTime() + 60 * 1000;
        localStorage.setItem(`otpExpiryTime_${email}`, newExpiryTime.toString());
        setTimer(60);
        setOtp(Array(6).fill(""));
        toast.success("A new OTP has been sent to your email.");
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
    } else {
      onVerify(otpString);
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Animation variants for modal container and inputs
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.25 } },
  };

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

 return (
  <AnimatePresence>
    {/* Removed the blue backdrop div */}
    <motion.div
      key="modal-container"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <Toaster position="top-center" richColors />
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-sky-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-sky-700">Verify Your Email</h3>
          <button
            onClick={handleModalClose}
            className="text-sky-500 hover:text-sky-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>

        <p className="text-center text-sky-600 mb-6">
          An OTP was sent to <span className="font-semibold">{email}</span>.
        </p>

        <div className="flex justify-center gap-3 sm:gap-5">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              type="tel"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-16 text-center text-3xl font-bold border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-400 focus:border-sky-600 transition-all"
              ref={(el) => (inputRefs.current[index] = el)}
              autoComplete="one-time-code"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus={{ scale: 1.1, borderColor: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9' }}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-sky-500">
            {timer > 0 ? (
              <span>Resend OTP in <span className="font-semibold">{timer}s</span></span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sky-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            onClick={handleVerify}
            className="px-8 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-sky-400"
          >
            Verify
          </button>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

};

export default OtpModal;
