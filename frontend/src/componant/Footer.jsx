import React from 'react'
import '../componentStyles/Footer.css'
import { Link } from 'react-router-dom'

function Footer() {
  const columns = {
    Shop: ["Plants", "Seeds", "Pots & Planters", "Best Sellers", "New Arrivals"],
    Services: ["Plant Care", "Plant Pots", "Plant Fertilizers", "Gardening Tools", "Gift Cards", "Corporate Gifts"],
    "About Us": ["Our Story", "Contact Us", "Careers", "Store Locator"],
    Help: ["FAQs", "Shipping", "Returns", "Track Order", "Privacy Policy"],
  };
  return <footer className="plant-footer">
    <div className="plant-footer-inner">
      <div className="plant-footer-brand"><div className="plant-footer-logo"><span>PH</span> Plant House</div><p>Thoughtfully grown plants for calmer homes, brighter desks and greener everyday rituals.</p><div className="plant-newsletter"><input type="email" placeholder="Enter your email" aria-label="Email address" /><button type="button">Subscribe</button></div></div>
      {Object.entries(columns).map(([title, links]) => <div className="plant-footer-column" key={title}><h3>{title}</h3>{links.map((label) => <Link key={label} to={label === "Contact Us" ? "/contact-us" : label === "Plants" ? "/products" : "#"}>{label}</Link>)}</div>)}
    </div>
    <div className="plant-footer-bottom"><span>© {new Date().getFullYear()} Plant House</span><div><Link to="#">Terms &amp; Conditions</Link><Link to="#">Shipping Policy</Link><Link to="#">Privacy Policy</Link></div></div>
  </footer>
}

export default Footer
