import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    rating: 5,
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/feedback/new", formData);
      if (response.data.success) {
        alert("Feedback submitted successfully!");
        setFormData({ name: "", image: "", rating: 5, comment: "" });
      } else {
        alert("Error submitting feedback");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting feedback");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Feedback
            </h6>
            <h1 className="mb-5">Share Your Feedback</h1>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image URL (optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Rating</label>
                  <select
                    className="form-control"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    id="comment"
                    name="comment"
                    rows="5"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
