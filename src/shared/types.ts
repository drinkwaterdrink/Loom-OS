import type { z } from "zod";
import type {
  AutoGenerationModeSchema,
  LegacyLoomOSStateSchema,
  LoomOSCompiledStateSchema,
  LoomOSSettingsSchema,
  LoomOSSkinSchema,
  LoomOSStateSchema,
  StateIdentitySchema,
  CustomModuleSchema,
  CustomModulePresetSchema,
  CustomModuleItemSchema,
  CustomModuleDataSchema,
  CustomModuleFieldSchema,
  StateHistoryItemSchema,
} from "./schemas";
export type {
  ModuleCatalogEntry,
  ModuleControl,
  ModuleKey,
  ModulePreset,
  StockModuleOverride,
} from "./modules";

export type LoomOSSkin = z.infer<typeof LoomOSSkinSchema>;
export type AutoGenerationMode = z.infer<typeof AutoGenerationModeSchema>;
export type LoomOSSettings = z.infer<typeof LoomOSSettingsSchema>;
export type StateIdentity = z.infer<typeof StateIdentitySchema>;
export type LoomOSCompiledState = z.infer<typeof LoomOSCompiledStateSchema>;
export type LoomOSState = z.infer<typeof LoomOSStateSchema>;
export type LegacyLoomOSState = z.infer<typeof LegacyLoomOSStateSchema>;
export type CustomModule = z.infer<typeof CustomModuleSchema>;
export type CustomModulePreset = z.infer<typeof CustomModulePresetSchema>;
export type CustomModuleItem = z.infer<typeof CustomModuleItemSchema>;
export type CustomModuleData = z.infer<typeof CustomModuleDataSchema>;
export type CustomModuleField = z.infer<typeof CustomModuleFieldSchema>;
export type StateHistoryItem = z.infer<typeof StateHistoryItemSchema>;

export interface PermissionSnapshot {
  generation: boolean;
  interceptor: boolean;
  chatMutation: boolean;
}

export interface ConnectionSummary {
  id: string;
  name: string;
  provider: string;
  model: string;
  isDefault: boolean;
  ready: boolean;
}

export type GenerationPhase =
  | "resolving"
  | "loading_seed"
  | "building_prompt"
  | "requesting"
  | "validating"
  | "repairing"
  | "saving";

export interface GenerationPipelineReport {
  phase: GenerationPhase;
  attempt: 1 | 2;
  elapsedMs: number;
  connectionId: string;
  message: string;
  normalized?: boolean;
  fallbackSaved?: boolean;
  issues?: string[];
  debugReport?: string;
}

export interface InjectionPreview {
  text: string;
  estimatedTokens: number;
  budget: number;
  withinBudget: boolean;
  includedModules: string[];
  omittedModules: string[];
  warning: string | null;
}
