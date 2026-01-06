import { createFileRoute } from "@tanstack/react-router";
import Footer from "@/components/footer";
export const Route = createFileRoute("/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container relative mx-auto max-w-3xl px-4 py-8 pt-18">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <header className="mb-12 text-center">
            <h1 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
              Privacy Policy
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
            <p className="mb-4 text-muted-foreground">
              english.now is an open-source, self-study English learning
              platform. We are committed to protecting your privacy and being
              transparent about how we handle your data. This Privacy Policy
              explains what information we collect, how we use it, and your
              rights regarding your personal data.
            </p>
            <p className="text-muted-foreground">
              As an open-source project, our code is publicly available for
              review, which means you can verify exactly how we handle your
              data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">
              Information We Collect
            </h2>

            <h3 className="mb-3 font-medium text-lg">Account Information</h3>
            <p className="mb-2 text-muted-foreground">
              When you create an account, we may collect:
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Email address</li>
              <li>Display name (optional)</li>
              <li>Profile picture (optional)</li>
              <li>Preferred learning settings</li>
            </ul>

            <h3 className="mb-3 font-medium text-lg">Learning Progress Data</h3>
            <p className="mb-2 text-muted-foreground">
              To provide personalized learning experiences, we collect:
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Vocabulary words you've studied and their review status</li>
              <li>Course progress and completion status</li>
              <li>Quiz and exercise results</li>
              <li>Study streaks and learning statistics</li>
            </ul>

            <h3 className="mb-3 font-medium text-lg">Technical Data</h3>
            <p className="mb-2 text-muted-foreground">
              We automatically collect certain technical information:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>General location (country/region level)</li>
              <li>Usage patterns and feature interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">
              How We Use Your Information
            </h2>
            <p className="mb-2 text-muted-foreground">
              We use your information to:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Provide and maintain the learning platform</li>
              <li>Track and display your learning progress</li>
              <li>Personalize your study experience using spaced repetition</li>
              <li>Send important service updates (with your consent)</li>
              <li>Improve the platform based on usage patterns</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">
              Data Storage & Security
            </h2>
            <p className="mb-4 text-muted-foreground">
              Your data is stored securely using industry-standard encryption.
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
            <p className="text-muted-foreground">
              As an open-source project, we believe in transparency. You can
              review our security practices in our public repository.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">Cookies</h2>
            <p className="mb-2 text-muted-foreground">
              We use essential cookies to:
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Ensure the platform functions properly</li>
            </ul>
            <p className="text-muted-foreground">
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">Third-Party Services</h2>
            <p className="mb-2 text-muted-foreground">
              We may use the following third-party services:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Authentication providers (for social login options)</li>
              <li>Analytics services (to improve the platform)</li>
              <li>Cloud hosting providers (for data storage)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">Your Rights</h2>
            <p className="mb-2 text-muted-foreground">You have the right to:</p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your learning progress data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="text-muted-foreground">
              To exercise any of these rights, you can use the settings in your
              account or contact us directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">Self-Hosting</h2>
            <p className="text-muted-foreground">
              Since english.now is open source, you have the option to self-host
              the platform. When self-hosting, you are responsible for your own
              data handling practices, and this Privacy Policy does not apply to
              self-hosted instances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">Children's Privacy</h2>
            <p className="text-muted-foreground">
              english.now is designed for users of all ages learning English. If
              you are under 13 years old, please have a parent or guardian
              review this policy and help you create an account. We do not
              knowingly collect personal information from children without
              parental consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-semibold text-xl">
              Open Source Transparency
            </h2>
            <p className="text-muted-foreground">
              english.now is fully open source. You can review our codebase,
              including how we handle data, on our public GitHub repository. We
              believe transparency is the foundation of trust.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-semibold text-xl">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data
              practices, please open an issue on our GitHub repository or reach
              out to us through our community channels.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </>
  );
}
