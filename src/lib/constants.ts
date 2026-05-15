export const categories = [
  "AI",
  "Design",
  "Development",
  "Finance",
  "Marketing",
  "Media",
  "Productivity",
  "Security"
] as const;

export const reminderOptions = [
  { label: "1 day before", value: "ONE_DAY" },
  { label: "3 days before", value: "THREE_DAYS" },
  { label: "7 days before", value: "SEVEN_DAYS" }
] as const;

export const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    description: "For solo tracking and trial cleanup.",
    features: ["Up to 10 subscriptions", "Trial progress bars", "Upcoming renewals view"],
    highlighted: false
  },
  {
    name: "Pro",
    price: "$8",
    description: "For people who live in subscriptions.",
    features: ["Unlimited subscriptions", "Email reminders", "Spend charts and analytics", "Category filtering and sorting"],
    highlighted: true
  },
  {
    name: "Business",
    price: "$18",
    description: "For growing teams and power users.",
    features: ["Everything in Pro", "Priority support", "Early access to new features", "Custom reminder schedules"],
    highlighted: false
  }
] as const;
