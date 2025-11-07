import { Agent, run, tool } from "@openai/agents";
import { z } from 'zod';
import axios from 'axios';

const getWeatherResultSchema = z.object({
    city: z.string().describe("Name of the City"),
    degree_c: z.string().describe("The degree celcius of the temperature"),
    condition: z.string().optional().describe("The condition of the weather")
})

const getWeatherTool = tool({
    name: "get_weather",
    description: "Get the weather in a given location",
    parameters: z.object({
        city: z.string().describe("Name of the City")
    }),
    execute: async function({ city }) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
        const response = await axios.get(url, { responseType: 'text' });
        // return `The weather of ${city} is ${response.data}`
    }
});

const agent = new Agent({
    name: "Agent",
    instructions: "You are an expert weather agent that helps user to tell the weather",
    model: "gpt-5-nano",
    tools: [getWeatherTool],
    outputType: getWeatherResultSchema
});

async function main(query = '') {
    const result = await run(agent, query);
    console.log("Result: ", result.finalOutput);
}

main();
