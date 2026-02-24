type BadgeProps = {
  label: string;
  className?: string;
};

const Badge = ({ label, className = "" }: BadgeProps) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
