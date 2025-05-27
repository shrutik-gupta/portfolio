import React from 'react'

const Experience = () => {
  return (
    <div>
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Experience</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              My professional journey and achievements
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Senior Frontend Developer",
                company: "Tech Company Inc.",
                duration: "2022 - Present",
                description: "Leading frontend development team, implementing modern React applications with TypeScript and building scalable component libraries."
              },
              {
                title: "Full Stack Developer",
                company: "Digital Agency",
                duration: "2020 - 2022",
                description: "Developed full-stack web applications using React, Node.js, and PostgreSQL. Collaborated with design teams to create responsive user interfaces."
              },
              {
                title: "Junior Developer",
                company: "Startup Co.",
                duration: "2019 - 2020",
                description: "Built and maintained multiple client websites, learned modern development practices and agile methodologies."
              }
            ].map((job, index) => (
              <div key={index} className="bg-bg-card rounded-lg p-8 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">{job.title}</h3>
                    <p className="text-accent-primary font-semibold">{job.company}</p>
                  </div>
                  <span className="text-text-secondary font-medium">{job.duration}</span>
                </div>
                <p className="text-text-secondary">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Experience
