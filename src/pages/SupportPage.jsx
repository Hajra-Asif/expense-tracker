import React, { useState } from 'react';
import { Card, Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SupportPage.css';

const SupportPage = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "10 Strategies to Beat Inflation in 2025",
      excerpt: "Learn how to protect your purchasing power with these proven inflation-beating strategies...",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Inflation",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      title: "The 50/30/20 Budget Rule Explained",
      excerpt: "Discover how this simple budgeting method can help you manage your finances effectively...",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Budgeting",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 3,
      title: "Tracking Expenses: Apps vs Spreadsheets",
      excerpt: "Compare the pros and cons of different expense tracking methods to find what works for you...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Expenses",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 4,
      title: "Side Hustles to Boost Your Income",
      excerpt: "Explore these legitimate ways to earn extra money in your spare time...",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Income",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 5,
      title: "Investing During High Inflation Periods",
      excerpt: "Find out which assets perform best when inflation is rising...",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Investing",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 6,
      title: "Emergency Funds: How Much is Enough?",
      excerpt: "Learn how to calculate and build your financial safety net...",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Savings",
      date: new Date().toLocaleDateString(),
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        user: auth.currentUser?.email || "Anonymous",
        message,
        createdAt: serverTimestamp(),
      });
      setMessage('');
      setStatus('success');
    } catch (error) {
      console.error("Error submitting message:", error);
      setStatus('error');
    }
  };

  return (
    <div className="support-page">
      <Sidebar />
      <div className="support-content">
        <div className="support-header">
          <h2>Support Center</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Support Message Form */}
        <Card className="support-form-card">
          <Card.Body>
            <Card.Title className="form-title">How Can We Help You?</Card.Title>
            <Form onSubmit={handleSupportSubmit}>
              <Form.Group controlId="supportMessage" className="mb-4">
                <Form.Label className="form-label">Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="form-textarea"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="submit-btn">
                Send Message
              </Button>
            </Form>
            {status === 'success' && (
              <Alert variant="success" className="mt-3 alert-message">
                Message sent successfully! We'll get back to you soon.
              </Alert>
            )}
            {status === 'error' && (
              <Alert variant="danger" className="mt-3 alert-message">
                Something went wrong. Please try again.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Financial Resources Section */}
        <div className="resources-section">
          <h3 className="section-title">Financial Resources</h3>
          <p className="section-subtitle">Expert advice to improve your financial health</p>
          
          <div className="blog-grid">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog.id}`} key={blog.id} className="blog-card-link">
                <Card className="blog-card">
                  <div className="blog-image-container">
                    <Card.Img variant="top" src={blog.image} className="blog-image" />
                    <span className="blog-category">{blog.category}</span>
                  </div>
                  <Card.Body className="blog-body">
                    <Card.Title className="blog-title">{blog.title}</Card.Title>
                    <Card.Text className="blog-excerpt">{blog.excerpt}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="blog-footer">
                    <small className="blog-date">{blog.date}</small>
                  </Card.Footer>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;