"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword, login, register, updateProfile, type FormState } from "@/lib/actions";
import type { Customer } from "@/lib/types";
import { Field } from "./form-field";

function Status({ state }: { state: FormState }) {
  if (state.error) return <p className="text-sm font-medium text-danger" role="alert">{state.error}</p>;
  if (state.ok) return <p className="text-sm font-medium text-ok" role="status">{state.ok}</p>;
  return null;
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={state.fields?.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required error={state.fields?.password} />
      {!state.fields?.email && <Status state={state} />}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Logging in…" : "Log in"}</button>
      <p className="text-center text-sm text-muted">
        New here? <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="font-medium text-brand underline">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(register, {});
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={v.name} error={state.fields?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={v.email} error={state.fields?.email} />
      <Field label="Mobile number (optional)" name="mobile" type="tel" autoComplete="tel" defaultValue={v.mobile} error={state.fields?.mobile} />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." error={state.fields?.password} />
      <Field label="Confirm password" name="password_confirmation" type="password" autoComplete="new-password" required minLength={8} error={state.fields?.password_confirmation} />
      {!state.fields && <Status state={state} />}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
      <p className="text-center text-sm text-muted">
        Already have an account? <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-medium text-brand underline">Log in</Link>
      </p>
    </form>
  );
}

export function ProfileForm({ customer }: { customer: Customer }) {
  const [state, action, pending] = useActionState(updateProfile, {});
  const v = state.values ?? { name: customer.name, mobile: customer.mobile ?? "", address: customer.address ?? "" };

  return (
    <form action={action} className="space-y-4">
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={v.name} error={state.fields?.name} />
      <Field label="Mobile number" name="mobile" type="tel" autoComplete="tel" defaultValue={v.mobile} error={state.fields?.mobile} />
      <Field label="Delivery address" name="address" autoComplete="street-address" textarea defaultValue={v.address} error={state.fields?.address} />
      <Status state={state} />
      <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Save details"}</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});

  return (
    <form action={action} className="space-y-4">
      <Field label="Current password" name="current_password" type="password" autoComplete="current-password" required error={state.fields?.current_password} />
      <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." error={state.fields?.password} />
      <Field label="Confirm new password" name="password_confirmation" type="password" autoComplete="new-password" required minLength={8} error={state.fields?.password_confirmation} />
      <Status state={state} />
      <button type="submit" className="btn btn-outline" disabled={pending}>{pending ? "Changing…" : "Change password"}</button>
    </form>
  );
}
