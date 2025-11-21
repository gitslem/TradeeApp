import { Mail, MessageCircle, HelpCircle, Clock, Shield } from 'lucide-react'
import TradingBackground from './TradingBackground'
import './Support.css'

const Support = () => {
  return (
    <div className="support-page">
      <TradingBackground variant="home" />

      {/* Hero Section */}
      <section className="support-hero">
        <div className="support-hero-content">
          <h1 className="support-title">Welcome to Tradee Support</h1>
          <p className="support-subtitle">
            We're here to help you get the most out of your trading tools. Whether you have questions,
            need assistance, or want to provide feedback, our team is ready to support you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="support-contact">
        <div className="contact-container">
          <div className="contact-header">
            <HelpCircle size={48} className="contact-icon" />
            <h2>Get in Touch</h2>
            <p>Have a question or need help? We'd love to hear from you!</p>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <Mail size={40} />
            </div>
            <h3>Email Support</h3>
            <p className="contact-description">
              Send us your questions, feedback, or feature requests. We typically respond within 24-48 hours.
            </p>
            <a href="mailto:tradee444@gmail.com" className="email-link">
              tradee444@gmail.com
            </a>
            <div className="contact-actions">
              <a href="mailto:tradee444@gmail.com" className="btn-contact-primary">
                <Mail size={20} />
                Send Email
              </a>
            </div>
          </div>

          <div className="support-info-grid">
            <div className="support-info-card">
              <Clock size={32} />
              <h3>Response Time</h3>
              <p>We aim to respond to all inquiries within 24-48 hours during business days.</p>
            </div>

            <div className="support-info-card">
              <MessageCircle size={32} />
              <h3>What to Include</h3>
              <p>Please include details about your issue, browser version, and any error messages you're seeing.</p>
            </div>

            <div className="support-info-card">
              <Shield size={32} />
              <h3>Your Privacy</h3>
              <p>We take your privacy seriously. Your information will never be shared with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="support-faq">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is Tradee really free?</h3>
              <p>
                Yes! Tradee is 100% free to use with no hidden fees, subscriptions, or premium tiers.
                All features are available to everyone at no cost.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do I need to register to use Tradee?</h3>
              <p>
                Most tools (Calculator, Market Structure, Price Action) require no registration.
                The Trading Journal requires a simple email login to save your data securely.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is my trading data secure?</h3>
              <p>
                Yes. Your trading journal data is stored locally in your browser and only synced to our
                secure servers when you're logged in. We never share your data with third parties.
              </p>
            </div>

            <div className="faq-item">
              <h3>Which exchanges are supported?</h3>
              <p>
                Our tools work with any cryptocurrency trading pair. The calculators and analysis tools
                are exchange-agnostic and work with Binance, Coinbase, Bybit, and all other major exchanges.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I export my trading journal data?</h3>
              <p>
                Absolutely! You can export your entire trading history to CSV format for further analysis
                in Excel, Google Sheets, or other tools.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I report a bug or request a feature?</h3>
              <p>
                Send us an email at tradee444@gmail.com with details about the bug or your feature request.
                We value your feedback and continuously improve based on user suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Support
