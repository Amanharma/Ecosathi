import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
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

export default function MissionSection() {
  return (
    <section className="py-20 bg-background" data-testid="section-mission">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold text-foreground mb-8"
            variants={itemVariants}
            data-testid="title-mission"
          >
            Our Mission
          </motion.h2>
        </motion.div>
        
        <motion.div
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={itemVariants} data-testid="text-mission-1">
            ECOSATHI empowers citizens to report civic issues instantly while providing authorities with intelligent tools for efficient resolution. We bridge the gap between citizens and government through digital innovation, creating transparent, accountable, and responsive civic governance.
          </motion.p>
          
          <motion.p variants={itemVariants} data-testid="text-mission-2">
            Our platform leverages AI-powered classification, blockchain transparency, and real-time tracking to transform how communities address infrastructure and environmental challenges.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
