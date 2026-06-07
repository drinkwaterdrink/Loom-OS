import { z } from "zod";

export const LoomOSSkinSchema = z.enum([
  "auto",
  "dark_academia",
  "cyberpunk",
  "fantasy",
  "horror",
  "noir",
  "minimal",
]);

export const AutoGenerationModeSchema = z.enum([
  "off",
  "assistant",
  "every",
  "manual",
]);

export const PanelVisibilitySchema = z.object({
  kernel: z.boolean().default(true),
  castMatrix: z.boolean().default(true),
  threadLoom: z.boolean().default(true),
  continuityFirewall: z.boolean().default(true),
}).strict();

export const LoomOSSettingsSchema = z.object({
  skin: LoomOSSkinSchema.default("auto"),
  autoGeneration: AutoGenerationModeSchema.default("manual"),
  injectionEnabled: z.boolean().default(false),
  injectionTokenBudget: z.number().int().min(80).max(1200).default(320),
  recentMessageLimit: z.number().int().min(4).max(80).default(24),
  connectionId: z.string().trim().max(200).default(""),
  panels: PanelVisibilitySchema.default({
    kernel: true,
    castMatrix: true,
    threadLoom: true,
    continuityFirewall: true,
  }),
}).strict();

export const StateIdentitySchema = z.object({
  chatId: z.string().min(1).max(300),
  messageId: z.string().min(1).max(300),
  swipeId: z.number().int().nonnegative(),
}).strict();

const ShortText = z.string().trim().max(500);
const MediumText = z.string().trim().max(1600);

export const KernelSchema = z.object({
  scene: ShortText,
  location: ShortText,
  timeframe: ShortText,
  tone: ShortText,
  objective: MediumText,
  summary: MediumText,
  constraints: z.array(ShortText).max(12),
}).strict();

export const CastMemberSchema = z.object({
  name: z.string().trim().min(1).max(160),
  role: ShortText,
  status: ShortText,
  location: ShortText,
  emotionalState: ShortText,
  goals: z.array(ShortText).max(8),
  relationships: z.array(ShortText).max(10),
  leverage: z.array(ShortText).max(8),
}).strict();

export const StoryThreadSchema = z.object({
  title: z.string().trim().min(1).max(240),
  status: z.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
  urgency: z.number().int().min(0).max(5),
  summary: MediumText,
  nextPressure: MediumText,
  participants: z.array(z.string().trim().max(160)).max(12),
}).strict();

export const ContinuityRiskSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText,
}).strict();

export const LoomOSCompiledStateSchema = z.object({
  kernel: KernelSchema,
  castMatrix: z.array(CastMemberSchema).max(24),
  threadLoom: z.array(StoryThreadSchema).max(24),
  continuityFirewall: z.object({
    establishedFacts: z.array(MediumText).max(30),
    pendingConsequences: z.array(MediumText).max(24),
    secrets: z.array(MediumText).max(24),
    risks: z.array(ContinuityRiskSchema).max(24),
  }).strict(),
}).strict();

export const LoomOSStateSchema = LoomOSCompiledStateSchema.extend({
  schemaVersion: z.literal(1),
  identity: StateIdentitySchema,
  generatedAt: z.string().datetime(),
  source: z.object({
    messageCount: z.number().int().nonnegative(),
    repaired: z.boolean(),
  }).strict(),
}).strict();

export const DEFAULT_SETTINGS = LoomOSSettingsSchema.parse({});
