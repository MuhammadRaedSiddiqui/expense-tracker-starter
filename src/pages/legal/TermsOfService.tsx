export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-container rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Terms of Service</h1>
          <p className="text-sm text-on-surface-variant mb-8">Last updated: April 21, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6 text-on-surface">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Financial Architect ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Financial Architect provides expense tracking, budget management, and team collaboration tools ("the Service").
                The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities
                that occur under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Scrape, copy, or duplicate content without permission</li>
                <li>Use the Service to send spam or unsolicited communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Subscription and Payment</h2>
              <p>
                Some features of the Service require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pay all fees associated with your subscription plan</li>
                <li>Provide accurate billing information</li>
                <li>Authorize automatic recurring charges</li>
                <li>Understand that fees are non-refundable except as required by law</li>
              </ul>
              <p className="mt-4">
                You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data and Privacy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. We collect, use, and protect your data
                as described in the Privacy Policy. You retain ownership of your data, and you may export or delete it at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p>
                The Service, including all content, features, and functionality, is owned by Financial Architect and is
                protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute,
                or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these Terms of Service
                or for any other reason. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT
                THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. USE OF THE SERVICE IS AT YOUR OWN RISK.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINANCIAL ARCHITECT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
                OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR GOODWILL.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify you of material changes
                by email or through the Service. Your continued use of the Service after changes constitutes acceptance
                of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@your-domain.com<br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-outline">
            <p className="text-sm text-on-surface-variant">
              ⚠️ <strong>Important:</strong> This is a template. Please consult with a lawyer to customize these terms
              for your specific business and jurisdiction before using them in production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
