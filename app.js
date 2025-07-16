import React, { useState } from 'react';

// Main App Component
function App() {
  // Placeholder for the profile image. User can replace this with their actual image URL.
  const profileImageUrl = "http://googleusercontent.com/file_content/1"; // This will be updated by the system with the user's image if provided in a previous turn.

  // State for the "Ask Me Anything" feature
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data extracted from the PDF
  const personalData = {
    name: "Menghong Lim",
    title: "Computer Science Student",
    aboutMe: "I am a third-year computer science student with a strong passion for technology and problem-solving. I am eager to learn and grow in software development, with a keen interest in programming, algorithms, and system design. Motivated and adaptable, I am looking for opportunities to apply my knowledge in real-world projects and expand my skills in a professional environment.",
    contact: {
      email: "limmenghong678@gmail.com",
      phone: "+855 92 914 664",
      location: "Phnom Penh, Cambodia",
    },
    experiences: [
      {
        title: "Personal Assistant",
        company: "AIA Cambodia",
        location: "Phnom Penh, Cambodia",
        duration: "Oct 2022 - Feb 2023",
        description: "Gained valuable insights into teamwork, communication, and time management.",
      },
      {
        title: "Logistic",
        company: "Phnom Penh Saat",
        location: "Phnom Penh, Cambodia",
        duration: "Feb 2023 - May 2023",
        description: "Managed logistical operations, contributing to efficient project execution.",
      },
    ],
    technicalSkills: {
      programming: ["Python", "Java", "C/C++", "JavaScript", "SQL"],
      webDevelopment: ["HTML", "CSS", "JavaScript (React, Node.js)"],
      databases: ["MySQL", "PostgreSQL"],
      versionControl: ["Git", "GitHub"],
      softwareDevelopment: ["OOP"],
      mobileAppDevelopment: ["Android", "Flutter"],
      cloudComputing: ["DigitalOcean"],
      networking: ["TCP/IP", "HTTP"],
    },
    softSkills: ["Problem-solving", "Team collaboration", "Communication", "Time management", "Adaptability"],
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "Paragon International University",
        location: "Phnom Penh, Cambodia",
        duration: "February 2022 - Present",
      },
      {
        degree: "High School",
        institution: "10 January 1979 High School",
        location: "Siem Reap, Cambodia",
        duration: "December 2021",
      },
    ],
    languages: [
      { name: "Khmer", proficiency: "Native language" },
      { name: "English", proficiency: "Intermediate" },
    ],
  };

  // Function to call the Gemini API
  const askGemini = async () => {
    setIsLoading(true);
    setAnswer(''); // Clear previous answer

    const portfolioContext = `
      Here is some information about Menghong Lim:
      Name: ${personalData.name}
      Title: ${personalData.title}
      About Me: ${personalData.aboutMe}
      Contact: Email - ${personalData.contact.email}, Phone - ${personalData.contact.phone}, Location - ${personalData.contact.location}
      Experiences:
        ${personalData.experiences.map(exp => `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}
      Technical Skills:
        Programming: ${personalData.technicalSkills.programming.join(', ')}
        Web Development: ${personalData.technicalSkills.webDevelopment.join(', ')}
        Databases: ${personalData.technicalSkills.databases.join(', ')}
        Version Control: ${personalData.technicalSkills.versionControl.join(', ')}
        Software Development: ${personalData.technicalSkills.softwareDevelopment.join(', ')}
        Mobile App Development: ${personalData.technicalSkills.mobileAppDevelopment.join(', ')}
        Cloud Computing: ${personalData.technicalSkills.cloudComputing.join(', ')}
        Networking: ${personalData.technicalSkills.networking.join(', ')}
      Soft Skills: ${personalData.softSkills.join(', ')}
      Education:
        ${personalData.education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.duration})`).join('\n')}
      Languages: ${personalData.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}

      Please answer the following question about Menghong Lim based *only* on the provided information. If the information is not available, state that you don't have enough information.
    `;

    const prompt = `${portfolioContext}\n\nQuestion: ${question}`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will automatically provide the API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setAnswer(text);
      } else {
        setAnswer("Sorry, I couldn't get a response. Please try again.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAnswer("An error occurred while fetching the answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for skill categories
  const SkillCategory = ({ title, skills }) => (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navigation Bar (Optional, can be added if sections become very long) */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#hero" className="text-2xl font-bold text-indigo-700">Menghong Lim</a>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-indigo-700 transition duration-300">About</a>
            <a href="#experience" className="text-gray-600 hover:text-indigo-700 transition duration-300">Experience</a>
            <a href="#skills" className="text-gray-600 hover:text-indigo-700 transition duration-300">Skills</a>
            <a href="#education" className="text-gray-600 hover:text-indigo-700 transition duration-300">Education</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-700 transition duration-300">Contact</a>
            <a href="#ask-me-anything" className="text-gray-600 hover:text-indigo-700 transition duration-300">Ask Me Anything ✨</a>
          </div>
          {/* Mobile menu button could go here */}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-32 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 text-center">
          <img
            src={profileImageUrl}
            alt="Menghong Lim"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/E0E7FF/4338CA?text=Image+Error"; }}
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 leading-tight animate-fade-in-up">
            Hi, I'm <span className="text-yellow-300">{personalData.name}</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 animate-fade-in-up delay-100">
            A passionate <span className="font-medium">{personalData.title}</span>
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-lg leading-relaxed text-gray-700">
              <p className="mb-4">{personalData.aboutMe}</p>
              <p className="mb-4">
                I am proficient in various programming languages and technologies, always eager to expand my knowledge and apply it to real-world challenges.
              </p>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Soft Skills</h3>
              <ul className="list-disc list-inside space-y-2">
                {personalData.softSkills.map((skill, index) => (
                  <li key={index} className="text-gray-700">{skill}</li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Personal Details</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong className="text-indigo-600">Email:</strong> <a href={`mailto:${personalData.contact.email}`} className="hover:underline">{personalData.contact.email}</a></li>
                <li><strong className="text-indigo-600">Phone:</strong> {personalData.contact.phone}</li>
                <li><strong className="text-indigo-600">Location:</strong> {personalData.contact.location}</li>
                <li><strong className="text-indigo-600">Nationality:</strong> Cambodian</li>
                <li><strong className="text-indigo-600">Sex:</strong> Male</li>
              </ul>
              <h3 className="text-2xl font-semibold text-indigo-700 mt-6 mb-4">Languages</h3>
              <ul className="space-y-3 text-gray-700">
                {personalData.languages.map((lang, index) => (
                  <li key={index}><strong className="text-indigo-600">{lang.name}:</strong> {lang.proficiency}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">Experience</h2>
          <div className="space-y-8">
            {personalData.experiences.map((exp, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{exp.title}</h3>
                <p className="text-lg text-gray-600 mb-2">{exp.company} | {exp.location}</p>
                <p className="text-md text-gray-500 mb-4">{exp.duration}</p>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCategory title="Programming" skills={personalData.technicalSkills.programming} />
            <SkillCategory title="Web Development" skills={personalData.technicalSkills.webDevelopment} />
            <SkillCategory title="Databases" skills={personalData.technicalSkills.databases} />
            <SkillCategory title="Version Control" skills={personalData.technicalSkills.versionControl} />
            <SkillCategory title="Software Development" skills={personalData.technicalSkills.softwareDevelopment} />
            <SkillCategory title="Mobile App Development" skills={personalData.technicalSkills.mobileAppDevelopment} />
            <SkillCategory title="Cloud Computing" skills={personalData.technicalSkills.cloudComputing} />
            <SkillCategory title="Networking" skills={personalData.technicalSkills.networking} />
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">Education</h2>
          <div className="space-y-8">
            {personalData.education.map((edu, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-2xl font-semibold text-purple-700 mb-2">{edu.degree}</h3>
                <p className="text-lg text-gray-600 mb-2">{edu.institution} | {edu.location}</p>
                <p className="text-md text-gray-500">{edu.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask Me Anything Section */}
      <section id="ask-me-anything" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-8">Ask Me Anything ✨</h2>
          <p className="text-lg text-gray-700 mb-8">
            Curious about my skills or experience? Ask a question below!
          </p>
          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., What is your experience with React?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  askGemini();
                }
              }}
            />
            <button
              onClick={askGemini}
              disabled={isLoading || !question.trim()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Ask ✨"
              )}
            </button>
          </div>
          {answer && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-xl shadow-md text-left">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3">Answer:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-100"> {/* Changed background to gray-100 for visual separation */}
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-8">Get In Touch</h2>
          <p className="text-lg text-gray-700 mb-8">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a
              href={`mailto:${personalData.contact.email}`}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0h18" />
              </svg>
              Email Me
            </a>
            <a
              href={`tel:${personalData.contact.phone}`}
              className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Me
            </a>
          </div>
          <p className="text-gray-600 mt-8">References available upon request.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Menghong Lim. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Add social media links here if you have them, e.g., GitHub, LinkedIn */}
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
              {/* GitHub Icon (replace with actual SVG or Font Awesome if available) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.809 1.305 3.493.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 22.106 24 17.619 24 12 24 5.373 18.627 0 12 0z"/>
              </svg>
            </a>
            {/* Example LinkedIn Icon */}
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0zM7.12 20.45H3.59V9.18h3.53v11.27zM5.35 7.64c-1.12 0-2.03-.91-2.03-2.03s.91-2.03 2.03-2.03 2.03.91 2.03 2.03-.91 2.03-2.03 2.03zM20.45 20.45h-3.53v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.96v5.69h-3.53V9.18h3.39v1.55h.05c.47-.89 1.63-1.83 3.34-1.83 3.58 0 4.24 2.36 4.24 5.42v6.13z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
