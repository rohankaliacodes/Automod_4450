import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";
import Header from "./Header";

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
        "service_2kz1t82",    // Replace with your EmailJS service ID
        "template_3w6kqbm",  // Replace with your EmailJS template ID
        formRef.current,
        "6TaBbWtdDIxaRj-3E"  // Replace with your EmailJS Public Key
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

  return (
    <div className="contact2-main-container">
      <Header />
      <div className="contact2-image">
        {/* Optionally add a "Back to Homepage" button here if needed */}
      </div>
      <div className="contact2-frame">
        <form ref={formRef} onSubmit={sendEmail}>
          <div className="contact2-frame-1">
            <div className="contact2-frame-2">
              <div className="contact2-frame-3">
                <div className="contact2-frame-4">
                  <span className="contact2-send-us-message">Send Us A Message</span>
                </div>
                <div className="contact2-frame-5">
                  <div className="contact2-frame-6">
                    <span className="contact2-name">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact2-frame-7"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="contact2-frame-8">
                    <span className="contact2-email">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact2-frame-9"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="contact2-frame-a">
                    <span className="contact2-subject">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact2-frame-b"
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                  <div className="contact2-frame-c">
                    <span className="contact2-message">Message</span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="contact2-frame-d"
                      placeholder="Enter your message"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="contact2-button-f">
            <span>Send</span></button>
        </form>
      </div>
    </div>
  );
}
