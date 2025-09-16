import { motion } from "framer-motion";

interface ImpactGoal {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

interface ImpactMetricProps {
  goal: ImpactGoal;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6
    }
  }
};

export default function ImpactMetric({ goal, index }: ImpactMetricProps) {
  return (
    <motion.div
      className="text-center"
      variants={cardVariants}
      data-testid={`metric-impact-${goal.id}`}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-4">
        <div className="text-4xl font-bold text-white mb-2" data-testid={`value-${goal.id}`}>
          {goal.value}
        </div>
      </div>
      <p className="text-white font-medium mb-1" data-testid={`label-${goal.id}`}>
        {goal.label}
      </p>
      <p className="text-white text-opacity-75 text-sm" data-testid={`sublabel-${goal.id}`}>
        {goal.sublabel}
      </p>
    </motion.div>
  );
}
