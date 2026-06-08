import { z } from "zod";
import { MODULE_KEYS } from "./modules";
import {
  CustomModuleSchema,
  ModuleControlSchema,
  ModuleKeySchema,
  StockModuleOverrideSchema,
} from "./schemas";
import type {
  CustomModule,
  LoomOSSettings,
} from "./types";
import type { ModuleKey } from "./modules";

const ModuleBundleBaseSchema = z.object({
  format: z.literal("loomos-module"),
  version: z.literal(1),
  exportedAt: z.string().datetime(),
}).strict();

export const StockModuleBundleSchema = ModuleBundleBaseSchema.extend({
  kind: z.literal("stock"),
  key: ModuleKeySchema,
  control: ModuleControlSchema,
  override: StockModuleOverrideSchema.default({}),
}).strict();

export const CustomModuleBundleSchema = ModuleBundleBaseSchema.extend({
  kind: z.literal("custom"),
  module: CustomModuleSchema,
}).strict();

export const ModuleBundleSchema = z.discriminatedUnion("kind", [
  StockModuleBundleSchema,
  CustomModuleBundleSchema,
]);

export type ModuleBundle = z.infer<typeof ModuleBundleSchema>;

export function exportStockModuleBundle(
  key: ModuleKey,
  settings: LoomOSSettings,
): ModuleBundle {
  return StockModuleBundleSchema.parse({
    format: "loomos-module",
    version: 1,
    exportedAt: new Date().toISOString(),
    kind: "stock",
    key,
    control: settings.moduleSettings[key],
    override: settings.stockModuleOverrides[key] ?? {},
  });
}

export function exportCustomModuleBundle(module: CustomModule): ModuleBundle {
  return CustomModuleBundleSchema.parse({
    format: "loomos-module",
    version: 1,
    exportedAt: new Date().toISOString(),
    kind: "custom",
    module,
  });
}

export function parseModuleBundle(value: unknown): ModuleBundle {
  const bundled = ModuleBundleSchema.safeParse(value);
  if (bundled.success) return bundled.data;

  const legacyCustom = CustomModuleSchema.safeParse(value);
  if (legacyCustom.success) return exportCustomModuleBundle(legacyCustom.data);

  if (
    typeof value === "object"
    && value !== null
    && "key" in value
    && typeof value.key === "string"
    && MODULE_KEYS.includes(value.key as ModuleKey)
  ) {
    const source = value as Record<string, unknown>;
    return StockModuleBundleSchema.parse({
      format: "loomos-module",
      version: 1,
      exportedAt: new Date().toISOString(),
      kind: "stock",
      key: source.key,
      control: source.control,
      override: source.override ?? {},
    });
  }

  throw new Error("This JSON is not a valid LoomOS stock or custom module bundle.");
}
