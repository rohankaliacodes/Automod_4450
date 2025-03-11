import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const formRef = useRef(); // Reference for form submission

  // State to store user input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission and send email
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_2kz1t82", // Replace with your EmailJS service ID
        "template_3w6kqbm", // Replace with your EmailJS template ID
        formRef.current,
        "6TaBbWtdDIxaRj-3E" // Replace with your EmailJS Public Key
      )
      .then(
        () => {
          alert("Message successfully sent!");
          setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
        },
        (error) => {
          alert("Failed to send the message, please try again!");
          console.error("EmailJS Error:", error);
        }
      );
  };

  // Navigate back to homepage
  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <div className="main-container">
      <div className="image">
        <button className="button" onClick={goToHomePage}>
          Back To Homepage
        </button>
      </div>
      <div className="frame">
        <form ref={formRef} onSubmit={sendEmail}>
          <div className="frame-1">
            <div className="frame-2">
              <div className="frame-3">
                <div className="frame-4">
                  <span className="send-us-message">Send Us A Message</span>
                </div>
                <div className="frame-5">
                  <div className="frame-6">
                    <span className="name">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="frame-7"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="frame-8">
                    <span className="email">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="frame-9"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="frame-a">
                    <span className="subject">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="frame-b"
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                  <div className="frame-c">
                    <span className="message">Message</span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="frame-d"
                      placeholder="Enter your message"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="button-f">Send</button>
        </form>
      </div>
    </div>
  );
}
