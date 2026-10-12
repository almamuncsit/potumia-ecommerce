"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow text-gold-deep">Something went wrong</p>
        <h1 className="font-display mt-3 text-4xl font-medium">We couldn&apos;t load this page</h1>
        <p className="mt-3 text-muted">Please try again in a moment. If it keeps happening, contact us and we&apos;ll help with your order.</p>
        <button type="button" onClick={reset} className="btn btn-primary mt-8">Try again</button>
      </div>
    </div>
  );
}
