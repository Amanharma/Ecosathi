import { motion } from "framer-motion";
import TeamCard from "@/components/ui/TeamCard";
import { teamMembers } from "@/data/teamMembers";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function TeamSection() {
  const firstRowMembers = teamMembers.slice(0, 4);
  const secondRowMembers = teamMembers.slice(4);

  return (
    <section className="py-20 bg-background" data-testid="section-team">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="title-team">
            Our Team
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-university">
            IILM University - School of Computer Science and Engineering
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Row 1 */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {firstRowMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
              />
            ))}
          </motion.div>
          
          {/* Row 2 */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {secondRowMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index + 4}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
