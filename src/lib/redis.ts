import { createClient } from "redis";

if (!process.env.REDIS_URL) {
    throw new Error("Fornceca a url do redis!")
} 

export const client = await createClient({
    url: process.env.REDIS_URL
}).connect()