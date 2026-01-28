import { motion } from 'framer-motion';
import { AboutSection } from '../components/AboutSection';
import { useNavigation } from '../context/NavigationContext';
import { getI18nService } from '../services/I18nService';
import './Page.scss';

export function AboutPage() {
  const { direction } = useNavigation();
  const i18nService = getI18nService();
  const isRTL = i18nService.getDirection() === 'rtl';
  
  const variants = {
    initial: (direction: string) => ({
      // Forward: slide in from right, Backward: slide in from left
      // In RTL, reverse the directions
      x: direction === 'forward' 
        ? (isRTL ? '-100%' : '100%')  // Forward: RTL from left, LTR from right
        : (isRTL ? '100%' : '-100%'), // Backward: RTL from right, LTR from left
      opacity: 1,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      // Forward: slide out to left, Backward: slide out to right
      // In RTL, reverse the directions
      x: direction === 'forward'
        ? (isRTL ? '100%' : '-100%')  // Forward: RTL to right, LTR to left
        : (isRTL ? '-100%' : '100%'), // Backward: RTL to left, LTR to right
      opacity: 1,
    }),
  };
  
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: 'linear' }}
      className="page"
      style={{ position: 'absolute', width: '100%' }}
    >
      <AboutSection />
    </motion.div>
  );
}
