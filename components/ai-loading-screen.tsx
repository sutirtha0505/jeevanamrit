'use client';

import { motion } from 'motion/react';
import { Loader2, Sparkles } from 'lucide-react';

interface AILoadingScreenProps {
  message?: string;
}

export function AILoadingScreen({ message = 'Analyzing herb with AI...' }: AILoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative"
          >
            <Loader2 className="w-16 h-16 text-primary" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {message}
            </h3>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              This may take a few moments...
            </motion.p>
          </div>

          {/* Progress Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </div>

          {/* AI Processing Steps */}
          <div className="w-full space-y-2">
            {[
              { step: 'Capturing image details', delay: 0 },
              { step: 'Identifying herb species with Gemini AI', delay: 0.3 },
              { step: 'Analyzing medicinal properties', delay: 0.6 },
              { step: 'Gathering cultivation information', delay: 0.9 },
              { step: 'Finding Ayurvedic applications', delay: 1.2 },
            ].map(({ step, delay }, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: delay,
                  duration: 0.5,
                }}
                className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    backgroundColor: ['#10b981', '#22c55e', '#10b981'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: delay,
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#10b981' }}
                />
                <span className="flex-1">{step}</span>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: delay + 0.5,
                  }}
                  className="text-xs text-green-500 font-medium"
                >
                  ✓
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
