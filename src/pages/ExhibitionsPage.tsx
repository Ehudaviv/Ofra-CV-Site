import { motion } from 'framer-motion';
import { ExhibitionsSection } from '../components/ExhibitionsSection';
import { useNavigation } from '../context/NavigationContext';
import { getI18nService } from '../services/I18nService';
import './Page.scss';

export function ExhibitionsPage() {
  const { direction } = useNavigation();
  const i18nService = getI18nService();
  const isRTL = i18nService.getDirection() === 'rtl';
  
  const variants = {
    initial: (direction: string) => ({
      // In RTL, reverse the animation direction
      x: direction === 'forward' 
        ? (isRTL ? '-100%' : '100%')  // Forward: RTL comes from left, LTR from right
        : (isRTL ? '100%' : '-100%'), // Backward: RTL comes from right, LTR from left
      opacity: 1,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      // In RTL, reverse the animation direction
      x: direction === 'forward'
        ? (isRTL ? '100%' : '-100%')  // Forward: RTL exits to right, LTR to left
        : (isRTL ? '-100%' : '100%'), // Backward: RTL exits to left, LTR to right
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
      <ExhibitionsSection />
    </motion.div>
  );
}
