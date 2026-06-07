import type { z } from "zod";
import type {
  AutoGenerationModeSchema,
  LoomOSCompiledStateSchema,
  LoomOSSettingsSchema,
  LoomOSSkinSchema,
  LoomOSStateSchema,
  StateIdentitySchema,
} from "./schemas";

export type LoomOSSkin = z.infer<typeof LoomOSSkinSchema>;
export type AutoGenerationMode = z.infer<typeof AutoGenerationModeSchema>;
export type LoomOSSettings = z.infer<typeof LoomOSSettingsSchema>;
export type StateIdentity = z.infer<typeof StateIdentitySchema>;
export type LoomOSCompiledState = z.infer<typeof LoomOSCompiledStateSchema>;
export type LoomOSState = z.infer<typeof LoomOSStateSchema>;

export interface PermissionSnapshot {
  generation: boolean;
  interceptor: boolean;
  chatMutation: boolean;
}
