import React from "react";
import { Code, ArrowRight } from "lucide-react";

const ProjectCard = ({ image, name, description, tech, link }) => (
  <div className="bg-bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col lg:flex-row w-full min-h-[70vh]">
    {/* Image */}
    <div className="w-full lg:w-1/2 h-64 lg:h-auto">
      <img src={image} alt={name} className="object-contain w-full h-full" />
    </div>

    {/* Content */}
    <div className="p-6 w-full lg:w-1/2 flex flex-col">
      <h3 className="text-xl font-bold text-text-primary mb-2">{name}</h3>
      <p className="text-text-secondary mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t) => (
          <span
            key={t}
            className="bg-accent-primary/10 text-accent-primary px-2 py-1 rounded text-sm"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex gap-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-1"
        >
          <Code className="w-4 h-4" />
          Code
        </a>
      </div>
    </div>
  </div>
);

export default ProjectCard;
