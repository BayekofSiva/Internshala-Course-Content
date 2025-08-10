import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand-badge">SG</span> ShoppyGlobe
          <p style={{opacity:.85, marginTop: 6}}>
            Bringing you quality products at warp speed 🚀
          </p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Email: <a href="mailto:support@shoppyglobe.com">support@shoppyglobe.com</a></p>
          <p>Phone: <a href="tel:+123456789">+1 234 567 89</a></p>
        </div>

        <div>
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook"/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="Twitter"/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram"/>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn"/>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} ShoppyGlobe. All rights reserved.
      </div>
    </footer>
  )
}