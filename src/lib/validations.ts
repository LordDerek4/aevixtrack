import { z } from "zod";

export const subscriptionSchema = z.object({
  serviceName: z.string().min(2, "Service name is required").max(80),
  category: z.string().min(2, "Choose a category"),
  cost: z.coerce.number().min(0, "Cost must be positive"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  renewalDate: z.string().min(1, "Renewal date is required"),
  notes: z.string().max(500).optional().or(z.literal("")),
  subscriptionType: z.enum(["PAID", "FREE_TRIAL", "FREEMIUM"]),
  status: z.enum(["ACTIVE", "CANCELLED", "ARCHIVED"]).default("ACTIVE"),
  isFreeTrial: z.boolean().default(false),
  trialEndsAt: z.string().optional().or(z.literal("")),
  reminders: z.array(z.enum(["ONE_DAY", "THREE_DAYS", "SEVEN_DAYS"])).default(["THREE_DAYS"])
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;

export type SubscriptionRecord = SubscriptionInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const settingsSchema = z.object({
  currency: z.string().min(3).max(3),
  darkMode: z.boolean(),
  emailReminders: z.boolean(),
  reminderOffsets: z.array(z.enum(["ONE_DAY", "THREE_DAYS", "SEVEN_DAYS"]))
});

export type SettingsInput = z.infer<typeof settingsSchema>;
