import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Petal",
  description: "Privacy Policy for Petal real-estate intelligence platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-manrope">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="font-canela text-5xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <div className="font-manrope text-gray-700 space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-black">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
            <p>
              Petal Construction ("we," "us," or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our AI-powered real-estate intelligence platform (the "Service").
            </p>
            <p className="mt-4">
              By using Petal, you consent to the data practices described in this policy. If you do 
              not agree with the terms of this privacy policy, please do not access or use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Email address and password (or Google OAuth credentials)</li>
              <li>Name and professional information</li>
              <li>Company affiliation and role (when provided)</li>
              <li>Authentication metadata and access logs</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Usage and Interaction Data</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Chat conversations and queries submitted to our AI assistant</li>
              <li>Property addresses and locations you research</li>
              <li>Generated reports and analysis results</li>
              <li>Feature usage patterns and preferences</li>
              <li>Session duration and frequency of access</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Technical Data</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system and platform details</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referral sources and navigation paths</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Service Provision:</strong> To provide and maintain our real-estate intelligence service</li>
              <li><strong>AI Processing:</strong> To power our AI assistant and analysis capabilities</li>
              <li><strong>Account Management:</strong> To authenticate users and manage access controls</li>
              <li><strong>Service Improvement:</strong> To analyze usage patterns and enhance our service features</li>
              <li><strong>Security:</strong> To detect and prevent fraudulent activities and ensure platform security</li>
              <li><strong>Communication:</strong> To send service updates, security alerts, and support communications</li>
              <li><strong>Compliance:</strong> To comply with legal obligations and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Data Storage and Security</h2>
            <p>
              We employ robust security measures to protect your information. Our data infrastructure includes:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Data Storage Locations:</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>PostgreSQL:</strong> Chat conversation history and user account data</li>
                <li><strong>AWS S3:</strong> Access control state, audit logs, and generated PDF reports</li>
                <li><strong>AWS DynamoDB:</strong> Optional authentication storage (when configured)</li>
                <li><strong>Local Filesystem:</strong> Temporary snapshots and report history</li>
              </ul>
            </div>
            <p className="mt-4">
              All data transmission uses industry-standard encryption (TLS 1.2+). Sensitive data is encrypted 
              at rest using AES-256 encryption. We implement access controls, regular security audits, and 
              monitoring systems to protect against unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. AI Processing and Third-Party Services</h2>
            <p>
              Our AI services process your queries and data to generate insights and reports. This involves:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>AI Model Providers:</strong> We use Anthropic Claude as our primary AI service for chat and analysis</li>
              <li><strong>Data Enrichment:</strong> We integrate with multiple real-estate data providers to enhance analysis</li>
              <li><strong>Processing:</strong> Your queries may be processed by third-party AI services to generate responses</li>
              <li><strong>Context Management:</strong> We compress and manage conversation context to maintain service efficiency</li>
            </ul>
            <p className="mt-4">
              We carefully select our AI and data service providers and ensure they maintain appropriate 
              security and privacy standards. These services are bound by contractual obligations to 
              protect your data and use it only for providing services to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Data Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Service Providers</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>AI Services:</strong> Anthropic Claude for processing user queries</li>
              <li><strong>Cloud Infrastructure:</strong> AWS for hosting, storage, and computing services</li>
              <li><strong>Real-Estate Data:</strong> Zoneomics, LoopNet, Redfin, FEMA, EPA, Census Bureau, and other data providers</li>
              <li><strong>Authentication:</strong> Google OAuth for social login functionality</li>
              <li><strong>Analytics:</strong> Third-party analytics services for usage insights</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Legal Requirements</h3>
            <p>We may disclose your information when required by law, court order, or government request, 
               or to protect our rights, property, or safety, or that of our users or the public.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Data Retention</h2>
            <p>We retain your information for different periods based on the type of data and purpose:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Chat History:</strong> Retained in our database for the duration of your account unless manually deleted</li>
              <li><strong>Account Data:</strong> Retained while your account remains active and for a period after account termination</li>
              <li><strong>Generated Reports:</strong> Stored in S3 for your access, with retention based on your subscription tier</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized after a reasonable period for service improvement</li>
              <li><strong>Audit Logs:</strong> Retained for security monitoring and compliance purposes</li>
            </ul>
            <p className="mt-4">
              You can request deletion of your data at any time, subject to legal and operational constraints. 
              Some data may be retained in anonymized or aggregated form for service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Access and Portability</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Request a copy of your personal data</li>
              <li>Request your data in a structured, machine-readable format</li>
              <li>Export your chat history and generated reports</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Correction and Deletion</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Correct inaccurate or incomplete personal information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Delete specific conversations or reports from your account</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Control and Preferences</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Manage your account settings and preferences</li>
              <li>Control email notification preferences</li>
              <li>Opt out of marketing communications (though not essential service communications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, maintain your session, 
              analyze usage patterns, and provide personalized features. Our cookie practices include:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
              <li><strong>Authentication Cookies:</strong> Keep you logged in and maintain your session</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how our service is used</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and customization choices</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings, though disabling certain cookies 
              may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. International Data Transfers</h2>
            <p>
              Petal operates globally and may transfer your data across international borders. When we 
              transfer data outside your country, we ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Standard contractual clauses with our service providers</li>
              <li>Adequacy decisions where available</li>
              <li>Other legally recognized transfer mechanisms</li>
            </ul>
            <p className="mt-4">
              Our cloud infrastructure is hosted on AWS, with data centers in multiple regions. We 
              store data primarily in regions that align with our user base and comply with applicable 
              data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Children's Privacy</h2>
            <p>
              Petal is not intended for use by individuals under the age of 18. We do not knowingly 
              collect personal information from children under 18. If we become aware that we have 
              collected personal information from a child under 18, we will take steps to delete such 
              information immediately. If you believe we have collected information from a child under 18, 
              please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Data Breach Notification</h2>
            <p>
              In the event of a data breach that may affect your personal information, we will notify 
              affected users and relevant authorities in accordance with applicable legal requirements. 
              Our notification will include details about the breach, the types of information affected, 
              and steps we recommend you take to protect yourself.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of any 
              material changes by posting the updated policy on our website and sending email 
              notifications to affected users. Your continued use of our service after such changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or want to exercise your data rights, 
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Email:</strong> usman@nura.construction</p>
              <p><strong>Website:</strong> www.nura.construction</p>
              <p><strong>Company:</strong> Petal</p>
            </div>
            <p className="mt-4">
              For data subject requests from the EU, please include "GDPR Request" in your email subject. 
              For requests from California, please include "CCPA Request" in your email subject. 
              We will respond to your request within the timeframe required by applicable law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}