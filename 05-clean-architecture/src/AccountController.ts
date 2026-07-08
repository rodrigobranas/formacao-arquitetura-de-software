import type { GetAccount } from "./GetAccount.ts";
import type HttpServer from "./HttpServer.ts";
import type { Signup } from "./Signup.ts";

export default class AccountController {

    constructor (readonly httpServer: HttpServer, readonly signup: Signup, readonly getAccount: GetAccount) {
        httpServer.route("post", "/signup", async (params: any, body: any) => {
            const input = body;
            const output = await signup.execute(input);
            return {
                accountId: output.accountId
            }
        });

        httpServer.route("get", "/accounts/:{accountId}", async (params: any, body: any) => {
            const accountId = params.accountId;
            const output = await getAccount.execute(accountId);
            return output;
        });
    }
    
}
