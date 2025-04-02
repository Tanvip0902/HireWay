import React from "react";

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, link }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-900 text-white transform transition-all duration-300 hover:shadow-lg hover:scale-105">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="text-gray-400">{description}</p>
      <a
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        View Resource →
      </a>
    </div>
  );
};

export default ResourceCard;
