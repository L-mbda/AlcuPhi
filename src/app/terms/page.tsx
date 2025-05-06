import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function Terms() {
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
            <FileText className="mr-3 h-6 w-6 text-zinc-300" />
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Terms of Service</h1>
          </header>

          <p className="mb-8 italic text-zinc-400">
            <em>Effective Date: May 5, 2025</em>
          </p>

          <article className="prose prose-invert prose-zinc max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">1. Introduction</h2>
              <p className="mt-3 text-zinc-300">
                These Terms of Service ("Terms") govern your use of alcuφ, an open-source platform ("Service") hosted
                and maintained by a sole developer. By accessing or using the Service, you agree to these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">2. Eligibility & User Accounts</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">2.1. Eligible Users</h3>
                <p className="mt-2 text-zinc-300">
                  The Service is available to students and the general public aged{" "}
                  <strong className="text-zinc-100">13 or older</strong>. We do not collect birthdates; by registering,
                  you affirm you meet the age requirement or have parental consent.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">2.2. Registration Requirements</h3>
                <p className="mt-2 text-zinc-300">
                  To register, you must provide your <strong className="text-zinc-100">full name</strong>,{" "}
                  <strong className="text-zinc-100">email address</strong>, and{" "}
                  <strong className="text-zinc-100">password</strong>. You are responsible for maintaining the
                  confidentiality of your login credentials and for all activities under your account.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">3. User Content & Conduct</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">3.1. Content Creation</h3>
                <p className="mt-2 text-zinc-300">
                  Registered users may create, upload, and share custom question sets strictly related to physics. All
                  content must be appropriate; no hate speech, harassment, or off-topic material is allowed.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">3.2. Prohibited Activities</h3>
                <p className="mt-2 text-zinc-300">
                  Account sharing (using another user's account) and multiple accounts per person are forbidden. Any
                  conduct that disrupts the Service or violates these Terms may result in suspension or termination.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">4. Intellectual Property</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">4.1. App Code License</h3>
                <p className="mt-2 text-zinc-300">
                  alcuφ's source code is dedicated to the public domain under the{" "}
                  <a
                    href="https://creativecommons.org/publicdomain/zero/1.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Creative Commons CC0 1.0 Universal License
                  </a>
                  , waiving all copyright and related rights where possible.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">4.2. User Contributions</h3>
                <p className="mt-2 text-zinc-300">
                  By submitting content, you grant alcuφ a royalty-free, worldwide, perpetual license to use, modify,
                  and distribute your contributions within the Service.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">5. Privacy & Data</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">5.1. Data Collection</h3>
                <p className="mt-2 text-zinc-300">
                  We collect only your <strong className="text-zinc-100">email address</strong> at sign-up. No
                  additional personal data or analytics are gathered.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">5.2. Data Use</h3>
                <p className="mt-2 text-zinc-300">
                  Emails are used solely for account authentication and password recovery. We do not share your email
                  with third parties.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">6. Disclaimers & Liability</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">6.1. Warranty Disclaimer</h3>
                <p className="mt-2 text-zinc-300">
                  The Service is provided <strong className="text-zinc-100">&#34;as-is&#34;</strong> without warranties
                  of any kind; updates are provided at our discretion.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">6.2. Limitation of Liability</h3>
                <p className="mt-2 text-zinc-300">
                  alcuφ and its developer shall not be liable for any direct, indirect, incidental, or consequential
                  damages, even if advised of the possibility thereof.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-200">7. Term, Termination & Changes</h2>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">7.1. Effective Date</h3>
                <p className="mt-2 text-zinc-300">
                  These Terms take effect on <strong className="text-zinc-100">May 5, 2025</strong>.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">7.2. Termination</h3>
                <p className="mt-2 text-zinc-300">
                  We may suspend or terminate any account at any time—without notice—if a user breaches these Terms or
                  causes disruptions, including within our Discord community.
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <h3 className="text-lg font-medium text-zinc-200">7.3. Amendments</h3>
                <p className="mt-2 text-zinc-300">
                  We may modify these Terms at any time; revised terms will be posted in-app and take effect
                  immediately.
                </p>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-200">8. Governing Law & Contact</h2>
              <div className="mt-5 rounded-lg bg-zinc-800 p-5">
                <p className="text-zinc-300">
                  These Terms are governed by the laws of the <strong className="text-zinc-100">United States</strong>.
                </p>
                <p className="mt-3 text-zinc-300">
                  For questions or notices, contact:{" "}
                  <a
                    href="mailto:support@alcuphi.me"
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@alcuphi.me
                  </a>
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
