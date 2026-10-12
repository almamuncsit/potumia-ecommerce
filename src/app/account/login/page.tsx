import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account-forms";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Log in" };

async function Form({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = (await searchParams).next;
  return <LoginForm next={typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account"} />;
}

export default function Page({ searchParams }: PageProps<"/account/login">) {
  return (
    <AuthShell title="Log in" lead="Welcome back. Log in to see your orders and check out faster.">
      <Suspense fallback={<div className="h-64" aria-busy="true" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
