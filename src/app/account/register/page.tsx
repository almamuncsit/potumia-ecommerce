import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/account-forms";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Create an account" };

async function Form({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = (await searchParams).next;
  return <RegisterForm next={typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account"} />;
}

export default function Page({ searchParams }: PageProps<"/account/register">) {
  return (
    <AuthShell title="Create an account" lead="It takes a minute. Save your details and follow your orders.">
      <Suspense fallback={<div className="h-64" aria-busy="true" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
