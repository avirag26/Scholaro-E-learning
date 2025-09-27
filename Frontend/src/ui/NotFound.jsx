import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const emojis = ['📚', '🎓', '✏️', '🖥️', '🧠']

export default function NotFoundPage() {
  const [isDay, setIsDay] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    setIsDay(hour >= 6 && hour < 18)
    document.documentElement.className = isDay ? 'light' : 'dark'
    return () => document.documentElement.classList.remove('light', 'dark')
  }, [isDay])

  // Modern Gradient Animation
  const GradientBackground = () => (
    <motion.div
      animate={{
        background: [
          'linear-gradient(120deg,#a1c4fd,#c2e9fb 70%)',
          'linear-gradient(120deg,#6366f1,#60a5fa 70%)',
          'linear-gradient(120deg,#a1c4fd,#c2e9fb 70%)',
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 0 }}
    />
  )

  const containerClass =
    'relative z-10 flex flex-col items-center justify-center min-h-screen p-6'

  return (
    <div>
      <GradientBackground />
      <div className={containerClass}>
        <motion.div
          className={`absolute left-8 top-8 px-4 py-2 rounded-xl backdrop-blur-lg shadow-2xl font-bold text-3xl
            ${isDay ? 'bg-white/80 text-sky-600' : 'bg-gray-900/80 text-sky-200'}`}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Scholaro
        </motion.div>

        <motion.div
          className={`mb-8 text-9xl font-black drop-shadow-2xl ${isDay ? 'text-sky-800' : 'text-sky-400'}`}
          initial={{ scale: 0.8, rotate: 12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          404
        </motion.div>

        <motion.h1
          className={`mb-2 text-5xl font-extrabold bg-clip-text
            ${
              isDay
                ? 'text-transparent bg-gradient-to-r from-sky-700 to-emerald-400'
                : 'text-transparent bg-gradient-to-r from-sky-300 to-indigo-400'
            }
            text-center`}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Oops! Page Not Found
        </motion.h1>
        
        <motion.p
          className={`mb-8 text-xl text-center px-4 ${
            isDay ? 'text-gray-700' : 'text-gray-300'
          }`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          It seems you've wandered off the learning path.
        </motion.p>

        <motion.a
          href="/"
          className={`px-8 py-4 rounded-full font-semibold shadow-lg ring-2 ring-sky-400 transition-transform text-lg
            ${isDay ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-white/80 hover:bg-white/90 text-sky-800'}
            `}
          initial={{ scale: 0.8, filter: 'blur(3px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.07, boxShadow: '0 2px 24px #38bdf8' }}
        >
           Back to Home
        </motion.a>

        <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-5 z-10">
          {emojis.map((emoji, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              animate={{
                y: [0, -18, 0],
                scale: [1, 1.3, 1],
                filter: [
                  'drop-shadow(0 0 0px #fff)',
                  'drop-shadow(0 4px 12px #38bdf8)',
                  'drop-shadow(0 0 0px #fff)'
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: idx * 0.18,
              }}
              whileHover={{ scale: 1.5, rotate: [0, 22, -22, 0] }}
              className="text-4xl cursor-pointer"
              aria-label="Animated learning emoji"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Optional: Illustrative SVG or Mascot with gentle rotation */}
        <motion.div
          className="absolute right-8 top-12 z-0 pointer-events-none"
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 8, opacity: 0.13 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        >
          {/* Replace below with a custom SVG illustration as desired */}
          <svg width="100" height="100" fill="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="#38bdf8" opacity=".3"/>
            <rect x="24" y="12" width="16" height="40" rx="8" fill="#fff" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}