import test from "node:test";
import assert from "node:assert/strict";

import { buildAgentSyncPlan } from "../src/lib/agent-sync.ts";

test("removes local agents that do not exist on the gateway and adds missing gateway agents", () => {
  const plan = buildAgentSyncPlan({
    companyId: "company-1",
    now: 123,
    localAgents: [
      {
        id: "stale-agent",
        companyId: "company-1",
        name: "Stale Agent",
        description: "",
        specialty: "general",
        createdAt: 1,
      },
      {
        id: "shared-agent",
        companyId: "company-1",
        name: "Shared Agent",
        description: "Keep me",
        specialty: "coding",
        createdAt: 2,
      },
    ],
    remoteAgents: [
      { id: "shared-agent", name: "Shared Agent" },
      { id: "fresh-agent", name: "Fresh Agent" },
    ],
  });

  assert.deepEqual(plan.staleAgentIds, ["stale-agent"]);
  assert.deepEqual(plan.agentsToCreate, [
    {
      id: "fresh-agent",
      companyId: "company-1",
      name: "Fresh Agent",
      description: "",
      specialty: "general",
      createdAt: 123,
    },
  ]);
});

test("does not invent a fallback agent when the gateway reports none", () => {
  const plan = buildAgentSyncPlan({
    companyId: "company-1",
    now: 456,
    localAgents: [
      {
        id: "ghost-agent",
        companyId: "company-1",
        name: "Ghost Agent",
        description: "",
        specialty: "general",
        createdAt: 1,
      },
    ],
    remoteAgents: [],
  });

  assert.deepEqual(plan.staleAgentIds, ["ghost-agent"]);
  assert.deepEqual(plan.agentsToCreate, []);
});
