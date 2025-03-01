import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="aboutUs">
    {/* Hero Section */}
    <section className="aboutHero">
      <h1>Empowering You to Master Programming</h1>
      <p>
        Join <strong>Schoolabe</strong> and start your journey towards becoming
        a skilled programmer with expert-led courses.
      </p>
    </section>

    {/* Why Choose Us */}
    <section className="aboutSection">
      <h2>🚀 Why Choose Schoolabe?</h2>
      <p>
        We make coding <strong>simple, structured, and career-focused</strong>.
        Whether you're just starting or preparing for <strong>top tech interviews</strong>, 
        our courses provide hands-on training and real-world projects.
      </p>
    </section>

    {/* What We Offer */}
    <section className="offerings">
      <h2>💡 What We Offer</h2>
      <div className="offerList">
        {[
          { title: "🔥 Expert-Led Courses", text: "Learn from industry professionals with structured roadmaps and projects." },
          { title: "🛠️ Hands-On Coding", text: "Practice coding inside your browser with our interactive coding environment." },
          { title: "🎯 Job-Ready Curriculum", text: "Master problem-solving & DSA to crack top tech interviews." },
          { title: "💬 Active Community", text: "Join thousands of learners, ask doubts, and grow together." },
        ].map((item, index) => (
          <div key={index} className="offerCard">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Call to Action */}
    <section className="cta">
      <h2>🎯 Ready to Master Coding?</h2>
      <p>Over <strong>50,000+ learners</strong> trust Schoolabe to build their careers in tech. Are you next?</p>
      <a href="/join-us" className="primaryBtn">Join Us Today</a>
    </section>
  </div>
  );
};

export default About;
