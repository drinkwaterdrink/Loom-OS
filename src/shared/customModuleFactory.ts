import {
  getEffectiveModuleCatalog,
  type ModuleKey,
} from "./modules";
import { CustomModuleSchema } from "./schemas";
import type {
  CustomModule,
  LoomOSSettings,
} from "./types";

export function createCustomModuleFromStock(
  key: ModuleKey,
  settings: LoomOSSettings,
  id: string,
): CustomModule {
  const module = getEffectiveModuleCatalog(settings).find((candidate) => candidate.key === key);
  if (!module) throw new Error(`Unknown stock module: ${key}`);
  const control = settings.moduleSettings[key];
  return CustomModuleSchema.parse({
    id,
    label: `${module.label} Custom`,
    group: module.group,
    description: module.description,
    enabled: control.track,
    display: control.display,
    inject: control.inject,
    compilerInstruction: module.compilerInstruction,
    outputMode: "cards",
    maxItems: 6,
    intensity: module.intensityLabel === "experimental" ? "experimental" : "medium",
    displayOrder: module.displayOrder + 1000,
    schemaFields: [],
  });
}
