import type {
  LoomOSSettings,
  LoomOSState,
  PermissionSnapshot,
  StateIdentity,
} from "./types";

export interface IdentityRequest {
  chatId: string;
  messageId?: string;
  swipeId?: number;
}

export type FrontendRequest =
  | { type: "ready"; active: IdentityRequest | null }
  | { type: "frontend_disposed"; chatId?: string }
  | { type: "get_settings"; requestId: string }
  | { type: "save_settings"; requestId: string; settings: LoomOSSettings }
  | { type: "get_state"; requestId: string; identity: IdentityRequest }
  | { type: "save_state"; requestId: string; state: LoomOSState }
  | { type: "delete_state"; requestId: string; identity: IdentityRequest }
  | { type: "generate_state"; requestId: string; identity: IdentityRequest }
  | { type: "cancel_generation"; requestId: string }
  | { type: "refresh_permissions"; requestId: string };

export type BackendResponse =
  | {
      type: "bootstrap";
      settings: LoomOSSettings;
      permissions: PermissionSnapshot;
      identity: StateIdentity | null;
      state: LoomOSState | null;
    }
  | { type: "settings"; requestId?: string; settings: LoomOSSettings }
  | {
      type: "state";
      requestId?: string;
      identity: StateIdentity | null;
      state: LoomOSState | null;
    }
  | {
      type: "generation_status";
      requestId: string;
      status: "started" | "completed" | "cancelled" | "failed";
      identity?: StateIdentity;
      message?: string;
    }
  | { type: "permissions"; requestId?: string; permissions: PermissionSnapshot }
  | { type: "error"; requestId?: string; message: string };
