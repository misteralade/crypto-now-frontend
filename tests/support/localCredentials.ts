import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type LocalAgentCredentials = {
  frontend?: {
    email?: string;
    password?: string;
    loginUrl?: string;
  };
  crm?: {
    email?: string;
    password?: string;
    loginUrl?: string;
  };
  guest?: {
    email?: string;
    walletAddress?: string;
    bankAccount?: {
      bankId?: string;
      accountNumber?: string;
    };
  };
};

const credentialsPath = resolve(process.cwd(), "../.agents/agent-credentials.json");

export function loadLocalAgentCredentials(): LocalAgentCredentials {
  const raw = readFileSync(credentialsPath, "utf8");
  return JSON.parse(raw) as LocalAgentCredentials;
}
