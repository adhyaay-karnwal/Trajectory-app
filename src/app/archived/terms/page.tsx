import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Petal",
  description: "Terms and Conditions for Petal real-estate intelligence platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-manrope">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="font-canela text-5xl font-bold text-gray-900 mb-8">
          Terms and Conditions
        </h1>
        
        <div className="font-manrope text-gray-700 space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-black">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Petal ("the Service"), operated by Petal Construction ("we," "us," or "our"), 
              you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Description of Service</h2>
            <p>
              Petal is an AI-powered real-estate intelligence platform that provides due diligence analysis, 
              zoning information, feasibility reports, market data, and property insights. Our service combines 
              multiple data sources with AI-powered analysis to help real estate developers, investors, 
              and professionals make informed decisions about property development and investment opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. User Accounts and Authentication</h2>
            <p>
              Access to Petal requires user authentication through email/password or Google OAuth. 
              Registration for an account does not guarantee access to the service. Access is granted at 
              the sole discretion of Petal and may be revoked at any time. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that 
              occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Subscription and Payment Terms</h2>
            <p>
              Petal operates on a subscription basis. By subscribing to our service, you agree to pay 
              all applicable fees as specified in your subscription plan. Payments are processed in 
 advance for the subscription period. All fees are non-refundable except as expressly stated in 
              these terms or as required by applicable law. We reserve the right to modify our pricing 
              at any time, with any changes taking effect at the start of your next billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Data Sources and Accuracy</h2>
            <p>
              Petal aggregates data from multiple third-party sources including municipal records, 
              zoning databases, flood maps, environmental data, commercial listing services, 
              demographic databases, and other real-estate data providers. While we strive to provide 
              accurate and up-to-date information, we cannot guarantee the completeness, accuracy, 
              or timeliness of all data. Users should independently verify critical information before 
              making investment or development decisions.
            </p>
            <p className="mt-4">
              Our service includes data from providers such as Zoneomics, LoopNet, Redfin, FEMA, 
              EPA, Census Bureau, and various other real-estate and government data sources. 
              These third-party services may have their own terms of service and data limitations 
              that affect the information available through Petal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. AI-Powered Analysis and Reports</h2>
            <p>
              Petal uses artificial intelligence and machine learning models to analyze property data, 
              generate insights, and create reports. AI-generated content is provided for informational 
              purposes only and should not be considered as legal, financial, or investment advice. 
              The accuracy and reliability of AI-generated analysis may vary based on data quality, 
              model limitations, and other factors.
            </p>
            <p className="mt-4">
              Users are responsible for reviewing and validating AI-generated insights before making 
              business decisions. We are not liable for any actions taken based on AI-generated content 
              or reports.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Acceptable Use</h2>
            <p>You may use our service for lawful purposes only. You agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Reverse engineer, decompile, or attempt to extract our source code or algorithms</li>
              <li>Use automated systems to access our service without prior written consent</li>
              <li>Interfere with or disrupt the service or servers connected to the service</li>
              <li>Share account credentials with unauthorized individuals</li>
              <li>Use the service to compete with Petal or replicate our functionality</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Petal service are owned by Petal Construction 
              and are protected by copyright, trademark, and other intellectual property laws. You may not 
              use our trademarks, service marks, or copyrighted material without our prior written permission.
            </p>
            <p className="mt-4">
              Reports and analyses generated through our service remain the property of Petal, though 
              you may use them for your internal business purposes. You may not resell, redistribute, 
              or commercially exploit our service or any derived content without explicit authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, Petal CONSTRUCTION SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING 
              FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="mt-4">
              IN NO CASE SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID 
              FOR THE SERVICE IN THE PRECEDING TWELVE (12) MONTHS. SOME JURISDICTIONS DO NOT ALLOW 
              THE EXCLUSION OF CERTAIN WARRANTIES OR LIMITATIONS OF LIABILITY, SO SOME OF THE ABOVE 
              LIMITATIONS MAY NOT APPLY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Disclaimers</h2>
            <p>
              THE Petal SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO 
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mt-4">
              WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE. 
              INFORMATION OBTAINED THROUGH THE SERVICE SHOULD NOT BE USED AS A SUBSTITUTE FOR 
              PROFESSIONAL LEGAL, FINANCIAL, OR REAL ESTATE ADVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Petal Construction and its officers, 
              directors, employees, and agents from and against any claims, liabilities, damages, 
              losses, and expenses, including without limitation reasonable legal and accounting fees, 
              arising out of or in any way connected with your access to or use of the service, 
              or your violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Term and Termination</h2>
            <p>
              These terms remain in effect as long as you use the service. We may terminate or suspend 
              your account immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the terms. Upon termination, your right to 
              use the service will cease immediately.
            </p>
            <p className="mt-4">
              All provisions of the terms which by their nature should survive termination shall 
              survive, including ownership provisions, warranty disclaimers, indemnity, and limitations 
              of liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. If we make material changes, 
              we will notify you by email or by posting a notice on our site prior to the effective 
              date of the changes. Your continued use of the service after such modifications constitutes 
              acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Governing Law</h2>
            <p>
              These terms shall be interpreted and governed by the laws of the jurisdiction in which 
              Petal Construction is incorporated, without regard to its conflict of law provisions. 
              Any disputes arising from these terms shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Email:</strong> usman@nura.construction</p>
              <p><strong>Website:</strong> www.nura.construction</p>
              <p><strong>Company:</strong> Petal</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}