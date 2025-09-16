import { motion } from "framer-motion";
import ImpactMetric from "@/components/ui/ImpactMetric";
import { impactGoals } from "../../data/impactGoals";

const backgroundDecoration = [
  { size: "w-24 h-24", position: "top-10 left-10" },
  { size: "w-16 h-16", position: "bottom-20 right-20" },
  { size: "w-12 h-12", position: "top-1/2 right-1/3" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ImpactSection() {
  return (
    <section className="py-20 gradient-purple relative overflow-hidden" data-testid="section-impact">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        {backgroundDecoration.map((decoration, index) => (
          <div
            key={index}
            className={`absolute ${decoration.size} ${decoration.position} bg-white rounded-full`}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-8" data-testid="title-impact">
            Project Impact Goals
          </h2>
        </div>
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {impactGoals.map((goal, index) => (
            <ImpactMetric
              key={goal.id}
              goal={goal}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
