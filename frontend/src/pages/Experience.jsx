import React from 'react'
import experience from '../helper/ExperienceHeper'
import ProjectCard from '../components/ProjectCard'
import ExperienceCard from '../components/ExperienceCard'

const Experience = () => {
  return (
    <div>
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Experience</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              My professional journey and Co/Extra-curricular activities
            </p>
          </div>

          <div className="space-y-8">
            {experience.map((job, index) => (
              <ExperienceCard {...job}/>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Experience
