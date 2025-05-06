import { ArrowLeft, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Platform
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-md shadow-zinc-950/50">
          <header className="mb-8 flex items-center border-b border-zinc-800 pb-6">
            <ShieldAlert className="mr-3 h-6 w-6 text-zinc-300" />
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Privacy Policy</h1>
          </header>

          <p className="mb-8 italic text-zinc-400">
            <em>Effective Date: May 5, 2025</em>
          </p>

          <article className="prose prose-invert prose-zinc max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">1. Introduction</h2>
              <p className="mt-3 text-zinc-300">
                This Privacy Policy explains how alcuφ ("we," "us," or "our") collects, uses, discloses, and safeguards
                your information when you use our Service. By accessing or using alcuφ, you consent to this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">2. Information We Collect</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">2.1. Account Information</h3>
                <p className="mt-2 text-zinc-300">
                  When you register, we collect your <strong className="text-zinc-100">full name</strong>,{" "}
                  <strong className="text-zinc-100">email address</strong>, and{" "}
                  <strong className="text-zinc-100">password</strong> to create and secure your account.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">2.2. Usage Data</h3>
                <p className="mt-2 text-zinc-300">
                  We automatically collect certain information about how you access and use the Service, such as device
                  type, browser version, pages visited, and timestamps. This is used for analytics and improving our
                  Service.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">3. How We Use Your Information</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">We use the information we collect to:</p>
                <ul className="mt-3 space-y-2 text-zinc-300">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Create, maintain, and secure your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Provide, personalize, and improve our Service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Communicate with you, including password resets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Monitor usage trends and detect/security issues</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">4. Data Hosting & Transfers</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  All user data is stored on servers located in the{" "}
                  <strong className="text-zinc-100">United States</strong>. If you access our Service from the EU, your
                  data will be transferred to and processed in the U.S., which may have different data protection laws
                  than your jurisdiction.
                </p>
                <p className="mt-4 text-zinc-300">
                  We take appropriate measures to ensure an adequate level of protection for your data, consistent with
                  applicable legal requirements.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">5. Legal Bases for EU Users (GDPR)</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  If you are located in the European Economic Area (EEA), our legal bases for processing your personal
                  data are:
                </p>
                <ul className="mt-3 space-y-2 text-zinc-300">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>
                      <strong className="text-zinc-100">Consent</strong>: when you opt in to features like email
                      updates.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>
                      <strong className="text-zinc-100">Contractual Necessity</strong>: to provide and maintain your
                      account.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>
                      <strong className="text-zinc-100">Legitimate Interests</strong>: for analytics, fraud prevention,
                      and service improvements, so long as those interests do not override your rights.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">6. Sharing Your Information</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">We do not sell your personal data. We may share information with:</p>
                <ul className="mt-3 space-y-2 text-zinc-300">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Service providers who help operate, host, or maintain the Service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Law enforcement or government authorities when required by law</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span>Successors in connection with a merger, acquisition, or sale</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">7. Your Rights</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">7.1. U.S. Users</h3>
                <p className="mt-2 text-zinc-300">
                  Depending on your state, you may have rights to access, correct, or delete your personal information.
                  To exercise these rights, contact us at support@alcuphi.me.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">7.2. EU/EEA Users</h3>
                <p className="mt-2 text-zinc-300">
                  You have the right to access, rectify, erase, restrict processing, object to processing, and data
                  portability. To exercise these rights, please email us at support@alcuphi.me. We may need to verify
                  your identity before processing requests.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">8. Security</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  We take commercially reasonable measures to protect your information from unauthorized access,
                  alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">9. Children's Privacy</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  Our Service is not intended for children under 13. We do not knowingly collect personal data from
                  anyone under 13. If you learn we have collected such data, please contact us to request deletion.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">10. Changes to This Policy</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  We may update this Privacy Policy at any time. We'll post the updated version in-app with a revised
                  "Effective Date." Continued use after changes constitutes acceptance.
                </p>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-200">11. Contact Us</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  If you have any questions or requests regarding this Privacy Policy, please contact us at{" "}
                  <a
                    href="mailto:support@alcuphi.me"
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@alcuphi.me
                  </a>
                  .
                </p>
              </div>
            </section>
          </article>

          <footer className="mt-12 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
            <p>© 2025 alcuφ. All rights dedicated to the public domain.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
