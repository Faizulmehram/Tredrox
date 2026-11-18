import { budgetRanges, projectTypes } from "@/content/contact";

/** Shared by the form (instant feedback) and the API route (the real check). */
export type ContactInput = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot: real visitors never see or fill this. */
  website: string;
};

export type ContactField = Exclude<keyof ContactInput, "website">;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const MESSAGE_MIN = 30;
export const MESSAGE_MAX = 3000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emptyContact(): ContactInput {
  return { name: "", email: "", company: "", projectType: "", budget: "", message: "", website: "" };
}

export function normalizeContact(raw: unknown): ContactInput {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const read = (key: keyof ContactInput, max: number) =>
    typeof source[key] === "string" ? (source[key] as string).trim().slice(0, max) : "";
  return {
    name: read("name", 120),
    email: read("email", 200),
    company: read("company", 160),
    projectType: read("projectType", 80),
    budget: read("budget", 40),
    message: read("message", MESSAGE_MAX + 100),
    website: read("website", 200),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (input.name.length < 2) errors.name = "Enter your full name.";

  if (!input.email) errors.email = "Enter your work email so we can reply.";
  else if (!EMAIL_PATTERN.test(input.email)) errors.email = "Check the email address, for example name@company.com.";

  if (!input.projectType) errors.projectType = "Choose a project type, or “Not sure yet”.";
  else if (!(projectTypes as readonly string[]).includes(input.projectType)) errors.projectType = "Choose a project type from the list.";

  if (input.budget && !(budgetRanges as readonly string[]).includes(input.budget)) {
    errors.budget = "Choose a budget range from the list.";
  }

  if (input.message.length < MESSAGE_MIN) {
    errors.message = `Tell us a little more about the project (at least ${MESSAGE_MIN} characters).`;
  } else if (input.message.length > MESSAGE_MAX) {
    errors.message = `Keep the description under ${MESSAGE_MAX} characters; we can go deeper on a call.`;
  }

  return errors;
}
