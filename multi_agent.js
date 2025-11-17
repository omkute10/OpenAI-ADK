import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import { z } from 'zod';

const fetchAvailablePlans = tool({
    name: "fetch_available_plans",
    description: "Fetches the available plans from the database",
    parameters: z.object({}),
    execute: async function({}) {
        return [{
            plan_id: '3',
            price_inr: 1499,
            speed: '200Mbps'
        }]
    }
});

const processRefund = tool({
    name: "process_refund",
    description: "Processes the refund for the user",
    parameters: z.object({
        customerId: z.string().describe("ID of the customer"),
        reason: z.string().describe("Reason for refund")
    }),
    execute: async function({customerId, reason}) {
        return `Refund processed for customer ${customerId} for reason ${reason}`;
    }
})

const refundAgent = new Agent({
    name: "Refund Agent",
    instructions: "You are an expert refund agent for an internet broadband company.",
    tools: [processRefund]
});

const salesAgent = new Agent({
    name: "Sales Agent",
    instructions: `You are an expert sales agent for an internet broadband company.
    Talk with the user and help them with what they need.
    `,
    tools: [fetchAvailablePlans, refundAgent.asTool({
        toolName: "refund_expert",
        toolDescription: "Handles refund questions and requests"
        })
    ]
});

async function runAgent(query= '', agent) {
    const result = await run(agent, query);
    console.log(result.finalOutput);
}

runAgent("Hey there, I want to know the available plans", salesAgent);

runAgent("Hey there, I want to refund my plan", refundAgent);


