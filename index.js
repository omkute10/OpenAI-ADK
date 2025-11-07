import 'dotenv/config';
import { Agent, run } from "@openai/agents";

const firstAgent = new Agent({
    name: "First Agent",
    instructions: "You are an Agent that always says firstAgent", 
    //Instruction can also be a function
    model: "gpt-5-nano"
});

const result = await run(firstAgent, "Hey there, my name is Om Kute");
console.log(result.finalOutput);

