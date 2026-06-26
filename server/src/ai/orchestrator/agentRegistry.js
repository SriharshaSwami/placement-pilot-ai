import { ResumeAgent, InterviewAgent, CodingAgent, CareerAgent, JobAgent, AnalyticsAgent } from '../agents/index.js';

class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.register(ResumeAgent);
    this.register(InterviewAgent);
    this.register(CodingAgent);
    this.register(CareerAgent);
    this.register(JobAgent);
    this.register(AnalyticsAgent);
  }

  register(agent) {
    this.agents.set(agent.name, agent);
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  getAllAgentNames() {
    return Array.from(this.agents.keys());
  }
}

export default new AgentRegistry();
