
import { Env } from "./types";
import { handleRequest } from "./helpers";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return await handleRequest(request, env, ctx);
	},
}
