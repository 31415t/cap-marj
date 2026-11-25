export const features = {
  contactForm: true,
  blog: false,
  accountArea: false,
  appointments: false,
  registrations: false,
  tests: false,
  qa: false,
} as const

export const hasAnyRubrique =
  features.blog || features.tests || features.qa