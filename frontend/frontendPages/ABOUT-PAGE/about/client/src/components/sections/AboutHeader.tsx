import { motion } from "framer-motion";

const backgroundDecoration = [
  { size: "w-32 h-32", position: "top-20 left-20" },
  { size: "w-20 h-20", position: "bottom-40 right-32" },
  { size: "w-16 h-16", position: "top-1/2 left-1/3" }
];

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut"
    }
  })
};

export default function AboutHeader() {
  return (
    <header className="gradient-purple min-h-screen flex items-center justify-center relative overflow-hidden" data-testid="header-about">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        {backgroundDecoration.map((decoration, index) => (
          <div
            key={index}
            className={`absolute ${decoration.size} ${decoration.position} bg-white rounded-full`}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Logo */}
        <motion.div
          className="mb-8"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full border-2 border-white border-opacity-30 mb-8" data-testid="logo-ecosathi">
            <span className="text-white font-bold text-lg">Eco</span>
          </div>
        </motion.div>
        
        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white mb-6"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          data-testid="title-main"
        >
          About ECOSATHI
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white text-opacity-90 mb-4 max-w-3xl mx-auto"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          data-testid="subtitle-main"
        >
          Revolutionizing Civic Governance Through AI and Blockchain
        </motion.p>
        
        {/* Footer Text */}
        <motion.p
          className="text-sm text-white text-opacity-75"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          data-testid="text-hackathon"
        >
          Smart India Hackathon 2025 - Clean and Green Technology
        </motion.p>
      </div>
    </header>
  );
}
