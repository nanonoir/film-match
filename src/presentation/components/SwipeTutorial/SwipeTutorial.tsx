/**
 * SwipeTutorial Component
 * Modal tutorial que muestra instrucciones de cómo usar la app
 * Se muestra en la primera visita y puede ser reactivado desde el botón de info
 */

import { motion } from 'framer-motion';
import { X, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button/Button';

interface SwipeTutorialProps {
  onClose: () => void;
}

export function SwipeTutorial({ onClose }: SwipeTutorialProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border-2 border-primary-purple/30 shadow-2xl shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-purple rounded-full blur-[100px] opacity-20" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-pink rounded-full blur-[100px] opacity-20" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/50"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Bienvenido a MovieMatch!
          </h2>
          <p className="text-gray-400">
            Desliza para encontrar tu próxima película favorita
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-6 mb-8">
          {/* Swipe Left */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <ArrowLeft className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Desliza a la izquierda</h3>
              <p className="text-sm text-gray-400">
                o presiona <X className="inline w-4 h-4 text-red-400" /> para descartar
              </p>
            </div>
          </motion.div>

          {/* Swipe Right */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-l from-green-500/10 to-transparent border border-green-500/20"
          >
            <div className="flex-1 text-right">
              <h3 className="text-white font-semibold mb-1">Desliza a la derecha</h3>
              <p className="text-sm text-gray-400">
                o presiona <Heart className="inline w-4 h-4 text-green-400" /> para dar match
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-6"
        >
          <p className="text-sm text-gray-300 text-center">
            💡 <span className="text-cyan-400 font-semibold">Consejo:</span> También puedes deslizar las tarjetas directamente con tu dedo o mouse
          </p>
        </motion.div>

        {/* Close Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={onClose}
            variant="primary"
            size="lg"
            className="w-full shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02]"
          >
            ¡Entendido, vamos a empezar!
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
