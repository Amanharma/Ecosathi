import { motion } from "framer-motion";

interface Innovation {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  iconShape: "circle" | "square";
}

interface InnovationCardProps {
  innovation: Innovation;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function InnovationCard({ innovation, index }: InnovationCardProps) {
  const shapeClass = innovation.iconShape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <motion.div
      className="bg-card rounded-xl p-8 shadow-lg card-hover"
      variants={cardVariants}
      whileHover={{ y: -4 }}
      data-testid={`card-innovation-${innovation.id}`}
    >
      <div className={`w-12 h-12 ${innovation.iconColor} ${shapeClass} flex items-center justify-center mb-6`} data-testid={`icon-${innovation.id}`}>
        <i className={`${innovation.icon} text-white text-xl`}></i>
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mb-4" data-testid={`title-${innovation.id}`}>
        {innovation.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`description-${innovation.id}`}>
        {innovation.description}
      </p>
    </motion.div>
  );
}
