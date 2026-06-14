import type { SpindleAPI } from "lumiverse-spindle-types";
import {
  ARTIFACT_LIBRARY_PATH,
  ArtifactLibrarySchema,
  EMPTY_ARTIFACT_LIBRARY,
  deleteArtifactRecord,
  restoreArtifactRecord,
  upsertArtifactRecord,
  type ArtifactLibrary,
  type ArtifactRecord,
  type LoomOSArtifact,
} from "../shared/artifacts";

export async function loadArtifactLibrary(
  spindle: SpindleAPI,
  userId: string,
): Promise<ArtifactLibrary> {
  const raw = await spindle.userStorage.getJson<unknown>(ARTIFACT_LIBRARY_PATH, {
    fallback: EMPTY_ARTIFACT_LIBRARY,
    userId,
  });
  const parsed = ArtifactLibrarySchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  spindle.log.warn("Invalid LoomOS artifact library found; a new library will be used.");
  return EMPTY_ARTIFACT_LIBRARY;
}

async function persistLibrary(
  spindle: SpindleAPI,
  userId: string,
  library: ArtifactLibrary,
): Promise<ArtifactLibrary> {
  const parsed = ArtifactLibrarySchema.parse(library);
  await spindle.userStorage.setJson(ARTIFACT_LIBRARY_PATH, parsed, {
    indent: 2,
    userId,
  });
  return parsed;
}

export async function saveArtifact(
  spindle: SpindleAPI,
  userId: string,
  artifact: LoomOSArtifact,
): Promise<{ library: ArtifactLibrary; record: ArtifactRecord }> {
  const current = await loadArtifactLibrary(spindle, userId);
  const next = upsertArtifactRecord(current, artifact);
  await persistLibrary(spindle, userId, next.library);
  return next;
}

export async function deleteArtifact(
  spindle: SpindleAPI,
  userId: string,
  artifactId: string,
): Promise<ArtifactLibrary> {
  const current = await loadArtifactLibrary(spindle, userId);
  return persistLibrary(spindle, userId, deleteArtifactRecord(current, artifactId));
}

export async function restoreArtifact(
  spindle: SpindleAPI,
  userId: string,
  artifactId: string,
  revision: number,
): Promise<{ library: ArtifactLibrary; record: ArtifactRecord }> {
  const current = await loadArtifactLibrary(spindle, userId);
  const next = restoreArtifactRecord(current, artifactId, revision);
  await persistLibrary(spindle, userId, next.library);
  return next;
}
