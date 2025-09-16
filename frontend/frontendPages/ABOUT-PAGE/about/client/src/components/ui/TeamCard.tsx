import { motion } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  year?: string;
  department?: string;
  email: string;
  avatar: string;
  color: string;
}

interface TeamCardProps {
  member: TeamMember;
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

export default function TeamCard({ member, index }: TeamCardProps) {
  const displayYear = member.year || member.department || "";

  return (
    <motion.div
      className="text-center"
      variants={cardVariants}
      data-testid={`card-team-${member.id}`}
    >
      <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4`} data-testid={`avatar-${member.id}`}>
        <span className="text-white font-bold text-lg">{member.avatar}</span>
      </div>
      <h3 className="font-semibold text-card-foreground text-lg mb-1" data-testid={`name-${member.id}`}>
        {member.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-1" data-testid={`role-${member.id}`}>
        {member.role}
      </p>
      <p className="text-muted-foreground text-sm mb-2" data-testid={`year-${member.id}`}>
        {displayYear}
      </p>
      <a
        href={`mailto:${member.email}`}
        className="text-primary text-sm hover:underline transition-colors"
        data-testid={`email-${member.id}`}
      >
        {member.email}
      </a>
    </motion.div>
  );
}
