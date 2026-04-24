import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Finance Tracker?",
    answer: "Finance Tracker is a collaborative expense management platform designed for modern teams. It helps organizations track spending, manage budgets, automate approvals, and gain real-time visibility into their cash flow with enterprise-grade precision."
  },
  {
    question: "How much does Finance Tracker cost?",
    answer: "We offer three pricing tiers: Basic (Free for up to 3 users with basic analytics), Pro ($49/month with unlimited users and advanced features), and Enterprise (custom pricing with dedicated support and integrations). All plans include a 14-day free trial with no credit card required."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes. We take security seriously with encryption in transit (HTTPS/TLS), encryption at rest, Row Level Security (RLS) in our database, regular security audits, and strict access controls. We're compliant with GDPR and CCPA regulations."
  },
  {
    question: "Can I import existing transactions?",
    answer: "Yes, you can import transactions via CSV or Excel files. We also support automatic bank synchronization for supported financial institutions. Go to Settings → Import/Export to get started."
  },
  {
    question: "How does multi-currency support work?",
    answer: "Finance Tracker supports 10+ major currencies with automatic conversion using real-time exchange rates. All transactions are converted to your base currency (USD by default) for unified reporting and analytics."
  },
  {
    question: "Can I invite team members?",
    answer: "Yes! Pro and Enterprise plans support unlimited team members. You can set granular permissions, create approval workflows, and manage departmental budgets. Go to Team Management to invite members."
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "You can export all your data at any time in CSV or JSON format. After cancellation, your data is retained for 30 days in case you want to reactivate. After 30 days, all data is permanently deleted (except where required by law)."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable, but you can cancel at any time and won't be charged for the next billing cycle."
  },
  {
    question: "How do budget alerts work?",
    answer: "You can set budget limits for categories or departments. When spending reaches 75%, 90%, or 100% of the budget, automatic alerts are sent via email and in-app notifications. You can customize alert thresholds in Settings."
  },
  {
    question: "Can I integrate with accounting software?",
    answer: "Enterprise plans include custom integrations with popular accounting software like QuickBooks, Xero, and FreshBooks. Contact our sales team to discuss your integration needs."
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Finance Tracker is a responsive web application that works on all devices. Native iOS and Android apps are on our roadmap for Q3 2026."
  },
  {
    question: "How do recurring transactions work?",
    answer: "You can set up recurring transactions (monthly subscriptions, rent, salaries, etc.) with custom schedules. The system automatically creates transactions on the specified dates and sends notifications before processing."
  },
  {
    question: "What reports can I generate?",
    answer: "Finance Tracker offers comprehensive reports including spending by category, income vs expenses over time, budget utilization, team member spending, and custom date range reports. All reports can be exported to PDF or Excel."
  },
  {
    question: "How do I delete my account?",
    answer: "Go to Settings → Account → Delete Account. You'll be asked to confirm and optionally export your data. Account deletion is permanent and cannot be undone after 30 days."
  },
  {
    question: "Do you provide customer support?",
    answer: "Yes! Basic and Pro plans include email support (response within 24-48 hours). Enterprise plans include priority support with dedicated account managers and 24/7 availability."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            Finance Tracker
          </Link>
          <Link to="/" className="text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-600">Everything you need to know about Finance Tracker</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-slate-900 pr-8">
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">Still have questions?</h2>
            <p className="text-slate-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <Link
              to="/sign-up"
              className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-6 text-sm text-slate-600">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
