import type {
  ConnectionSummary,
  GenerationPipelineReport,
  InjectionPreview,
  LoomOSSettings,
  LoomOSState,
  PermissionSnapshot,
  StateHistoryItem,
  StateIdentity,
} from "./types";
import type {
  ArtifactLibrary,
  ArtifactRecord,
  LoomOSArtifact,
} from "./artifacts";

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
  | { type: "get_connections"; requestId: string }
  | { type: "get_state"; requestId: string; identity: IdentityRequest }
  | { type: "load_history_state"; requestId: string; identity: StateIdentity }
  | { type: "save_state"; requestId: string; state: LoomOSState }
  | { type: "delete_state"; requestId: string; identity: IdentityRequest }
  | { type: "delete_history_state"; requestId: string; identity: StateIdentity }
  | { type: "generate_state"; requestId: string; identity: IdentityRequest }
  | { type: "cancel_generation"; requestId: string }
  | { type: "refresh_permissions"; requestId: string }
  | { type: "get_chat_states"; requestId: string; chatId: string }
  | { type: "list_state_history"; requestId: string; chatId: string }
  | { type: "preview_injection"; requestId: string; chatId: string }
  | { type: "get_artifacts"; requestId: string }
  | { type: "save_artifact"; requestId: string; artifact: LoomOSArtifact }
  | { type: "delete_artifact"; requestId: string; artifactId: string }
  | { type: "restore_artifact"; requestId: string; artifactId: string; revision: number }
  | {
      type: "generate_artifact";
      requestId: string;
      kind: LoomOSArtifact["kind"];
      brief: string;
      currentArtifact?: LoomOSArtifact | null;
    }
  | { type: "cancel_artifact_generation"; requestId: string }
  | {
      type: "install_artifact";
      requestId: string;
      artifact: LoomOSArtifact;
      selectedArtifactIds?: string[];
      applySettings?: boolean;
      activateTheme?: boolean;
    };

export type BackendResponse =
  | {
      type: "bootstrap";
      settings: LoomOSSettings;
      permissions: PermissionSnapshot;
      connections: ConnectionSummary[];
      identity: StateIdentity | null;
      state: LoomOSState | null;
      artifacts: ArtifactLibrary;
    }
  | { type: "settings"; requestId?: string; settings: LoomOSSettings }
  | { type: "connections"; requestId?: string; connections: ConnectionSummary[] }
  | {
      type: "state";
      requestId?: string;
      identity: StateIdentity | null;
      state: LoomOSState | null;
    }
  | {
      type: "generation_status";
      requestId: string;
      status: "started" | "progress" | "completed" | "cancelled" | "failed";
      identity?: StateIdentity;
      message?: string;
      report?: GenerationPipelineReport;
    }
  | { type: "permissions"; requestId?: string; permissions: PermissionSnapshot }
  | { type: "error"; requestId?: string; message: string }
  | {
      type: "chat_states";
      requestId?: string;
      chatId: string;
      states: Array<{ messageId: string; swipeId: number }>;
    }
  | {
      type: "state_history";
      requestId?: string;
      chatId: string;
      items: StateHistoryItem[];
    }
  | {
      type: "history_state_deleted";
      requestId?: string;
      chatId: string;
      identity: StateIdentity;
      items: StateHistoryItem[];
    }
  | {
      type: "injection_preview";
      requestId?: string;
      preview: InjectionPreview | null;
    }
  | { type: "artifacts"; requestId?: string; library: ArtifactLibrary }
  | {
      type: "artifact_saved";
      requestId: string;
      library: ArtifactLibrary;
      record: ArtifactRecord;
    }
  | {
      type: "artifact_deleted";
      requestId: string;
      library: ArtifactLibrary;
      artifactId: string;
      settings: LoomOSSettings;
    }
  | {
      type: "artifact_generation_status";
      requestId: string;
      status: "started" | "progress" | "completed" | "cancelled" | "failed";
      message: string;
      elapsedMs: number;
      attempt: 1 | 2;
      artifact?: LoomOSArtifact;
      issues?: string[];
    }
  | {
      type: "artifact_installed";
      requestId: string;
      settings: LoomOSSettings;
      library: ArtifactLibrary;
      installedIds: string[];
      message: string;
    };
