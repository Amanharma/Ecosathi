import { motion } from "framer-motion";
import InnovationCard from "@/components/ui/InnovationCard";
import { innovations } from "../../data/innovations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function InnovationSection() {
  return (
    <section className="py-20 bg-muted" data-testid="section-innovation">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-8" data-testid="title-innovation">
            Key Innovation Highlights
          </h2>
        </div>
        
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {innovations.map((innovation, index) => (
            <InnovationCard
              key={innovation.id}
              innovation={innovation}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
