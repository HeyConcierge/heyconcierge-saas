'use client'

import { useState, useEffect } from 'react'

interface AnimatedMascotProps {
  className?: string
  mood?: 'idle' | 'thinking' | 'happy' | 'waving'
  size?: number
}

export default function AnimatedMascot({ className = '', mood = 'idle', size = 120 }: AnimatedMascotProps) {
  const [blink, setBlink] = useState(false)

  // Blink every 3-5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  const eyeRy = blink ? 0.5 : 5

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
    >
      <style>{`
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes mascotWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        @keyframes hatWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        @keyframes antennaGlow {
          0%, 100% { r: 3; opacity: 1; }
          50% { r: 4.5; opacity: 0.7; }
        }
        @keyframes thinkPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes blushPulse {
          0%, 100% { opacity: 0.4; rx: 5; }
          50% { opacity: 0.65; rx: 5.5; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .mascot-body {
          animation: mascotBounce ${mood === 'happy' ? '0.6s' : '2.5s'} infinite ease-in-out;
        }
        .mascot-hat {
          animation: hatWiggle ${mood === 'waving' ? '0.4s' : '3s'} infinite ease-in-out;
          transform-origin: 50px 22px;
        }
        .mascot-antenna {
          animation: antennaGlow 2s infinite ease-in-out;
        }
        .mascot-think {
          animation: thinkPulse 1.2s infinite ease-in-out;
        }
        .mascot-blush {
          animation: blushPulse 3s infinite ease-in-out;
        }
        .mascot-sparkle {
          animation: sparkle 2s infinite ease-in-out;
          transform-origin: center;
        }
      `}</style>

      <g className="mascot-body">
        {/* Body / head circle */}
        <circle cx="50" cy="50" r="35" fill="#6C5CE7" />
        {/* Face */}
        <circle cx="50" cy="53" r="24" fill="#F0EDFF" />

        {/* Eyes */}
        <ellipse cx="42" cy="48" rx="4" ry={eyeRy} fill="#2D2B55">
          {mood === 'happy' && <animate attributeName="ry" values="5;3;5" dur="0.6s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="58" cy="48" rx="4" ry={eyeRy} fill="#2D2B55">
          {mood === 'happy' && <animate attributeName="ry" values="5;3;5" dur="0.6s" repeatCount="indefinite" />}
        </ellipse>

        {/* Eye highlights */}
        {!blink && (
          <>
            <circle cx="43" cy="46" r="1.5" fill="white" />
            <circle cx="59" cy="46" r="1.5" fill="white" />
          </>
        )}

        {/* Mouth */}
        {mood === 'happy' ? (
          <path d="M42 56 Q50 64 58 56" stroke="#2D2B55" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : mood === 'thinking' ? (
          <circle cx="52" cy="58" r="3" fill="none" stroke="#2D2B55" strokeWidth="1.5" />
        ) : (
          <path d="M44 57 Q50 62 56 57" stroke="#2D2B55" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Blush */}
        <ellipse className="mascot-blush" cx="35" cy="55" rx="5" ry="3" fill="#FFB8B8" opacity="0.5" />
        <ellipse className="mascot-blush" cx="65" cy="55" rx="5" ry="3" fill="#FFB8B8" opacity="0.5" />

        {/* Hat */}
        <g className="mascot-hat">
          <rect x="38" y="18" width="24" height="10" rx="3" fill="#FF6B6B" />
          <circle className="mascot-antenna" cx="50" cy="17" r="3" fill="#FDCB6E" />
        </g>

        {/* Thinking dots */}
        {mood === 'thinking' && (
          <>
            <circle className="mascot-think" cx="72" cy="38" r="2.5" fill="#6C5CE7" opacity="0.4" />
            <circle className="mascot-think" cx="78" cy="30" r="2" fill="#6C5CE7" opacity="0.3" style={{ animationDelay: '0.3s' }} />
            <circle className="mascot-think" cx="82" cy="23" r="1.5" fill="#6C5CE7" opacity="0.2" style={{ animationDelay: '0.6s' }} />
          </>
        )}

        {/* Happy sparkles */}
        {mood === 'happy' && (
          <>
            <g className="mascot-sparkle" style={{ animationDelay: '0s' }}>
              <path d="M18 30 L20 28 L22 30 L20 32 Z" fill="#FDCB6E" />
            </g>
            <g className="mascot-sparkle" style={{ animationDelay: '0.7s' }}>
              <path d="M78 28 L80 26 L82 28 L80 30 Z" fill="#55EFC4" />
            </g>
            <g className="mascot-sparkle" style={{ animationDelay: '1.4s' }}>
              <path d="M25 65 L27 63 L29 65 L27 67 Z" fill="#FF6B6B" />
            </g>
          </>
        )}
      </g>
    </svg>
  )
}
