import type { ReactElement } from "react";
import WorkspaceClient from "@/core/features/workspace/workspace-client";

export default function NewActaPage(): ReactElement {
  return <WorkspaceClient slug="actas" />;
}
