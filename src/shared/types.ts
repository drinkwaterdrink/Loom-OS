import type { z } from "zod";
import type {
  AutoGenerationModeSchema,
  LegacyLoomOSStateSchema,
  LoomOSCompiledStateSchema,
  LoomOSSettingsSchema,
  LoomOSSkinSchema,
  LoomOSStateSchema,
  StateIdentitySchema,
} from "./schemas";
export type {
  ModuleControl,
  ModuleKey,
  ModulePreset,
} from "./modules";

export type LoomOSSkin = z.infer<typeof LoomOSSkinSchema>;
export type AutoGenerationMode = z.infer<typeof AutoGenerationModeSchema>;
export type LoomOSSettings = z.infer<typeof LoomOSSettingsSchema>;
export type StateIdentity = z.infer<typeof StateIdentitySchema>;
export type LoomOSCompiledState = z.infer<typeof LoomOSCompiledStateSchema>;
export type LoomOSState = z.infer<typeof LoomOSStateSchema>;
export type LegacyLoomOSState = z.infer<typeof LegacyLoomOSStateSchema>;

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
}
