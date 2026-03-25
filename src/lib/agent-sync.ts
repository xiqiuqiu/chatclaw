import type { Agent } from "@/types";

export interface GatewayAgentSummary {
  id: string;
  name: string;
}

interface BuildAgentSyncPlanInput {
  companyId: string;
  localAgents: Agent[];
  remoteAgents: GatewayAgentSummary[];
  now?: number;
}

interface AgentSyncPlan {
  staleAgentIds: string[];
  agentsToCreate: Agent[];
}

export function buildAgentSyncPlan({
  companyId,
  localAgents,
  remoteAgents,
  now = Date.now(),
}: BuildAgentSyncPlanInput): AgentSyncPlan {
  const remoteIds = new Set(remoteAgents.map((agent) => agent.id));
  const localIds = new Set(localAgents.map((agent) => agent.id));

  return {
    staleAgentIds: localAgents
      .filter((agent) => !remoteIds.has(agent.id))
      .map((agent) => agent.id),
    agentsToCreate: remoteAgents
      .filter((agent) => !localIds.has(agent.id))
      .map((agent) => ({
        id: agent.id,
        companyId,
        name: agent.name || agent.id,
        description: "",
        specialty: "general",
        createdAt: now,
      })),
  };
}
