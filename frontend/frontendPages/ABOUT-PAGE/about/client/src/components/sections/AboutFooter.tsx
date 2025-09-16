import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function AboutFooter() {
  return (
    <footer className="bg-slate-800 py-16" data-testid="footer-about">
      <motion.div
        className="container mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Logo */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h3 className="text-3xl font-bold text-white" data-testid="logo-footer">ECOSATHI</h3>
        </motion.div>
        
        {/* Tagline */}
        <motion.p className="text-gray-300 text-lg mb-4" variants={itemVariants} data-testid="text-tagline">
          Revolutionizing Civic Governance Through Technology
        </motion.p>
        
        {/* Project Info */}
        <motion.p className="text-gray-400 text-sm mb-4" variants={itemVariants} data-testid="text-project-info">
          Smart India Hackathon 2025 | Problem Statement ID: SIH25031
        </motion.p>
        
        {/* Copyright */}
        <motion.p className="text-gray-500 text-xs" variants={itemVariants} data-testid="text-copyright">
          © 2025 ECOSATHI Team - IILM University. All rights reserved.
        </motion.p>
      </motion.div>
    </footer>
  );
}
