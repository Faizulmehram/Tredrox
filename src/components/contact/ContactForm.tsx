"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { budgetRanges, projectTypes } from "@/content/contact";
import { Select, type SelectOption } from "./Select";
import {
  emptyContact,
  MESSAGE_MAX,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypeOptions: SelectOption[] = projectTypes.map((type) => ({ value: type, label: type }));
const budgetOptions: SelectOption[] = [
  { value: "", label: "Prefer to discuss" },
  ...budgetRanges.map((range) => ({ value: range, label: range })),
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const fieldBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 text-[0.9875rem] text-fg placeholder:text-faint " +
  "transition-[border-color,background-color,box-shadow] duration-200 ease-out " +
  "hover:border-white/20 focus:border-cobalt-bright focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(43,99,245,0.18)] focus:outline-none";

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = usePrefersReducedMotion();

  function update(field: keyof ContactInput, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted && field !== "website") {
      const all = validateContact(next);
      setErrors((current) => ({ ...current, [field]: all[field as ContactField] }));
    }
  }

  function blur(field: ContactField) {
    if (!values[field] && !attempted) return;
    const all = validateContact(values);
    setErrors((current) => ({ ...current, [field]: all[field] }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    setServerMessage("");

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: ContactErrors;
      };
      if (response.ok && data.ok) {
        setStatus("success");
        setValues(emptyContact());
        setAttempted(false);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerMessage(data.message ?? "Something went wrong on our side. Please try again.");
      setStatus("error");
    } catch {
      setServerMessage("We could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(4px)" },
      };

  return (
    <div className="panel relative overflow-hidden p-6 sm:p-9">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(43,99,245,0.14),transparent)]" />
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            className="relative flex min-h-[32rem] flex-col items-start justify-center"
            transition={{ duration: 0.4, ease: EASE_OUT }}
            {...swap}
          >
            <CheckCircle2 aria-hidden className="size-10 text-cobalt-bright" strokeWidth={1.5} />
            <h3 ref={(el) => el?.focus()} tabIndex={-1} className="type-h3 mt-6 text-fg focus:outline-none">
              Your project brief is in.
            </h3>
            <p className="mt-3 max-w-[30rem] text-[0.9875rem] leading-relaxed text-fg-2">
              Thank you. We will read it and reply to the email you gave us to set up a first call.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="link-draw mt-8 text-[0.9375rem] font-medium text-cobalt-soft hover:text-fg"
            >
              Send another brief
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            className="relative grid grid-cols-1 gap-5 sm:grid-cols-2"
            transition={{ duration: 0.3, ease: EASE_OUT }}
            {...swap}
          >
            <Field label="Full name" name="name" error={errors.name}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  className={cn(fieldBase, "h-12", props.className)}
                />
              )}
            </Field>
            <Field label="Work email" name="email" error={errors.email}>
              {(props) => (
                <input
                  {...props}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  className={cn(fieldBase, "h-12", props.className)}
                />
              )}
            </Field>
            <Field label="Company" name="company" optional>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={cn(fieldBase, "h-12", props.className)}
                />
              )}
            </Field>
            <Field label="Project type" name="projectType" error={errors.projectType}>
              {(props) => (
                <Select
                  {...props}
                  value={values.projectType}
                  options={projectTypeOptions}
                  placeholder="Choose one"
                  onChange={(value) => update("projectType", value)}
                  onBlur={() => blur("projectType")}
                  className={cn(fieldBase, "h-12 pr-4", props.className)}
                />
              )}
            </Field>
            <Field label="Estimated budget" name="budget" optional error={errors.budget} className="sm:col-span-2">
              {(props) => (
                <Select
                  {...props}
                  value={values.budget}
                  options={budgetOptions}
                  placeholder="Prefer to discuss"
                  onChange={(value) => update("budget", value)}
                  className={cn(fieldBase, "h-12 pr-4", props.className)}
                />
              )}
            </Field>
            <Field
              label="Project description"
              name="message"
              error={errors.message}
              className="sm:col-span-2"
              hint={`${values.message.length} / ${MESSAGE_MAX}`}
            >
              {(props) => (
                <textarea
                  {...props}
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  onBlur={() => blur("message")}
                  placeholder="What are you building, who is it for, and what should it change for the business?"
                  className={cn(fieldBase, "min-h-[9.5rem] resize-y py-3 leading-relaxed", props.className)}
                />
              )}
            </Field>

            {/* Honeypot: hidden from people and assistive tech, catches bots. */}
            <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </label>
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[22rem] text-[0.8125rem] leading-snug text-faint">
                We use these details only to reply about your project. See our{" "}
                <a href="/privacy" className="text-muted underline decoration-white/25 underline-offset-4 hover:text-fg">
                  privacy notice
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                className="group/btn relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-cobalt px-6 font-medium text-white shadow-[0_1px_0_0_rgb(255_255_255/0.22)_inset,0_1px_2px_rgb(0_0_0/0.4)] transition-[transform,background-color] duration-200 ease-out hover:bg-[#3a70ff] active:scale-[0.97] disabled:cursor-progress disabled:opacity-75"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    Sending your brief
                  </>
                ) : (
                  <>
                    Let&rsquo;s Build Something Great
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-out group-hover/btn:-translate-y-px group-hover/btn:translate-x-px"
                    />
                  </>
                )}
              </button>
            </div>

            <div aria-live="polite" className="sm:col-span-2">
              {status === "error" && serverMessage ? (
                <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/[0.06] px-4 py-3 text-[0.9375rem] text-fg-2">
                  <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
                  {serverMessage}
                </p>
              ) : null}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type ControlProps = {
  id: string;
  name: string;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
  className: string;
};

function Field({
  label,
  name,
  error,
  optional,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.875rem] font-medium text-fg-2">
          {label}
          {optional ? <span className="ml-1.5 font-normal text-faint">(optional)</span> : null}
        </label>
        {hint ? <span className="text-[0.75rem] tabular-nums text-faint">{hint}</span> : null}
      </div>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        "aria-required": optional ? undefined : true,
        className: error ? "border-danger/60" : "border-line-strong",
      })}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-[0.8125rem] text-danger">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
