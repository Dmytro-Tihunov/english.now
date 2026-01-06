import { createFileRoute, Link } from "@tanstack/react-router";
import Footer from "@/components/footer";

export const Route = createFileRoute("/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container relative mx-auto max-w-3xl px-4 py-8 pt-18">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <header className="mb-12 text-center">
            <h1 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </header>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Introduction</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Welcome to <strong>English.now</strong> ("Platform," "we," "us,"
              or "our"), an open-source English learning self-study platform and
              application. By accessing or using our Services, you agree to be
              bound by these Terms of Service ("Terms").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              English.now is designed to help users improve their English
              language skills through interactive lessons, vocabulary training,
              grammar exercises, fluency practice, and AI-powered learning
              tools.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Open Source License</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              English.now is an open-source project. The source code is
              available under the terms of the applicable open-source license
              (see our{" "}
              <a
                href="https://github.com/Dmytro-Tihunov/english.now"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                GitHub repository
              </a>{" "}
              for specific license details).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are free to use, modify, and distribute the source code in
              accordance with the open-source license. However, these Terms
              govern your use of the hosted Platform and Services provided by
              us.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Acceptance of Terms</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              By creating an account, accessing, or using English.now, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our{" "}
              <Link
                to="/privacy"
                className="text-primary underline hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree to these Terms, please do not use our
              Services. We reserve the right to modify these Terms at any time,
              and your continued use of the Platform constitutes acceptance of
              any changes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 13 years old to use English.now. If you are
              under 18, you must have parental or guardian consent to use our
              Services. By using the Platform, you represent and warrant that
              you meet these eligibility requirements.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Account Registration
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              To access certain features, you may need to create an account.
              When registering, you agree to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>
                Notify us immediately of any unauthorized access to your account
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these Terms or engage in suspicious activity.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Services Provided</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              English.now offers the following learning features:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Vocabulary Training:</strong> Build and expand your
                English vocabulary through interactive exercises and spaced
                repetition
              </li>
              <li>
                <strong>Grammar Lessons:</strong> Learn English grammar rules
                with clear explanations and practice exercises
              </li>
              <li>
                <strong>Fluency Practice:</strong> Improve speaking and
                listening skills through conversation practice
              </li>
              <li>
                <strong>AI-Powered Chat:</strong> Practice English conversations
                with our AI language assistant
              </li>
              <li>
                <strong>Progress Tracking:</strong> Monitor your learning
                journey with detailed progress reports
              </li>
              <li>
                <strong>Courses:</strong> Structured learning paths tailored to
                different proficiency levels
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">User Conduct</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              When using English.now, you agree NOT to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users' accounts
              </li>
              <li>
                Upload or transmit viruses, malware, or other malicious code
              </li>
              <li>Harass, abuse, or harm other users</li>
              <li>
                Use automated systems or bots to access the Platform without
                permission
              </li>
              <li>
                Reproduce, duplicate, or exploit any portion of the Service for
                commercial purposes without express permission
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Platform
              </li>
              <li>
                Attempt to reverse engineer or decompile any portion of the
                Services (except as permitted by the open-source license)
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">User Content</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              You may submit content through the Platform, including but not
              limited to chat messages, practice responses, and feedback ("User
              Content"). You retain ownership of your User Content, but you
              grant us a non-exclusive, worldwide, royalty-free license to use,
              store, and process your User Content solely for the purpose of
              providing and improving our Services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are solely responsible for your User Content and represent
              that you have all necessary rights to submit such content.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Intellectual Property
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              While the source code is open-source, our educational content,
              lesson materials, branding, logos, and other proprietary materials
              remain the exclusive property of English.now and its licensors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may not use our trademarks, logos, or branding without prior
              written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              AI Features and Limitations
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              English.now uses artificial intelligence to power certain
              features, including conversation practice and personalized
              recommendations. Please be aware that:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                AI-generated content may occasionally contain errors or
                inaccuracies
              </li>
              <li>
                AI features are intended to supplement, not replace,
                professional language instruction
              </li>
              <li>
                We continuously work to improve AI accuracy but cannot guarantee
                perfection
              </li>
              <li>
                AI interactions should not be used for high-stakes decisions or
                professional translation needs
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Pricing and Payments
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              English.now offers both free and premium features. For paid plans:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Prices are displayed in your local currency where available
              </li>
              <li>
                Subscriptions automatically renew unless cancelled before the
                renewal date
              </li>
              <li>
                You may cancel your subscription at any time through your
                account settings
              </li>
              <li>
                Refunds are handled in accordance with applicable laws and our
                refund policy
              </li>
              <li>
                We reserve the right to modify pricing with reasonable notice
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Community Contributions
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              As an open-source project, we welcome community contributions. By
              contributing code, content, or suggestions to English.now:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                You agree to license your contributions under the same
                open-source license as the project
              </li>
              <li>
                You represent that you have the right to make such contributions
              </li>
              <li>
                You understand that contributions may be modified, rejected, or
                removed at our discretion
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Disclaimer of Warranties
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We do not warrant that the Services will be uninterrupted,
              error-free, secure, or free of viruses or other harmful
              components.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ENGLISH.NOW AND ITS
              AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
              DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE OF
              THE PLATFORM.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless English.now and
              its affiliates from any claims, damages, losses, liabilities, and
              expenses (including legal fees) arising out of your use of the
              Platform, your User Content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Termination</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              We may suspend or terminate your access to the Platform at any
              time, with or without cause or notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third
              parties.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your account at any time by contacting us or
              through your account settings. Upon termination, your right to use
              the Services will immediately cease.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which English.now operates,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will
              notify users of significant changes by posting a notice on the
              Platform or sending an email. Your continued use of the Services
              after changes become effective constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-semibold text-2xl">Contact Us</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>GitHub:</strong>{" "}
                <a
                  href="https://github.com/Dmytro-Tihunov/english.now"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  github.com/Dmytro-Tihunov/english.now
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@english.now"
                  className="text-primary underline hover:no-underline"
                >
                  support@english.now
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-12 rounded-lg border bg-muted/50 p-6">
            <p className="text-center text-muted-foreground text-sm">
              By using English.now, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </>
  );
}
