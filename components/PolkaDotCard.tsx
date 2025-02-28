import React from 'react';

type PolkaDotCardProps = {
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const PolkaDotCard: React.FC<PolkaDotCardProps> = ({
  gradient,
  borderColor,
  icon,
  title,
  description,
}) => {
  return (
    <div
      className={`relative p-6 rounded-lg ${gradient} border-2 border-${borderColor} polka-dot aspect-square flex flex-col items-center justify-center`}>
      <div className="absolute top-4 left-4">{icon}</div>
      <h3 className="text-white text-xl font-bold text-center">{title}</h3>
      <p className="text-white text-sm text-center mt-2">{description}</p>
    </div>
  );
};

export default PolkaDotCard;
