export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-container rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Privacy Policy</h1>
          <p className="text-sm text-on-surface-variant mb-8">Last updated: April 21, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6 text-on-surface">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Financial Architect ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password</li>
                <li><strong>Organization Information:</strong> Organization name, member details</li>
                <li><strong>Financial Data:</strong> Transaction descriptions, amounts, categories, dates, currencies</li>
                <li><strong>Budget Information:</strong> Budget limits, spending categories</li>
                <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
                <li><strong>Analytics:</strong> Aggregated usage statistics via PostHog</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send receipts</li>
                <li>Send important notifications (budget alerts, team invitations)</li>
                <li>Respond to your support requests</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Analyze usage patterns to improve features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
              <p>We do not sell your personal information. We may share your information with:</p>

              <h3 className="text-xl font-semibold mt-4 mb-2">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Clerk:</strong> Authentication and user management</li>
                <li><strong>Supabase:</strong> Database hosting and storage</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Resend:</strong> Email delivery</li>
                <li><strong>Sentry:</strong> Error tracking and monitoring</li>
                <li><strong>PostHog:</strong> Analytics and product insights</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">4.2 Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government request, or to protect
                our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold mt-4 mb-2">4.3 Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.
                We will notify you before your information is transferred and becomes subject to a different privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p>We implement security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption in transit (HTTPS/TLS)</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Row Level Security (RLS) in our database</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your
                information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR & CCPA)</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, go to Settings → Privacy or contact us at privacy@your-domain.com.
                We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide the Service.
                When you delete your account, we will delete your personal data within 30 days, except where we are
                required to retain it for legal or compliance purposes.
              </p>
              <p className="mt-4">
                <strong>Backup retention:</strong> Deleted data may remain in backups for up to 90 days before permanent deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential cookies:</strong> Required for authentication and security</li>
                <li><strong>Analytics cookies:</strong> To understand how you use the Service</li>
                <li><strong>Preference cookies:</strong> To remember your settings</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Disabling essential cookies may affect functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate
                safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p>
                The Service is not intended for children under 13 (or 16 in the EU). We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or
                through the Service. The "Last updated" date at the top indicates when the policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="mt-2">
                Email: privacy@your-domain.com<br />
                Data Protection Officer: dpo@your-domain.com<br />
                Address: [Your Business Address]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Supervisory Authority</h2>
              <p>
                If you are in the EU/EEA, you have the right to lodge a complaint with your local data protection authority
                if you believe we have not complied with applicable data protection laws.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-outline">
            <p className="text-sm text-on-surface-variant">
              ⚠️ <strong>Important:</strong> This is a template. Please consult with a lawyer to customize this policy
              for your specific business, jurisdiction, and data practices before using it in production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
