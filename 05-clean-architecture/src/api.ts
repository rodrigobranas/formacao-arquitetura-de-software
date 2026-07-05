// Driven Adapter

import express, { type Request, type Response } from "express";
import cors from "cors";
import type { Signup } from "./Signup.ts";
import type { GetAccount } from "./GetAccount.ts";
import type { Deposit } from "./Deposit.ts";

export default class API {

    constructor (
        readonly signup: Signup,
        readonly getAccount: GetAccount,
        readonly deposit: Deposit
    ) {
        const app = express();
        app.use(express.json());
        app.use(cors());

        app.post("/signup", async (req: Request, res: Response) => {
            const input = req.body;
            try {
                const output = await this.signup.execute(input);
                res.json({
                    accountId: output.accountId
                });
            } catch (e: any) {
                res.json({
                    error: e.message
                });
            }
        });

        app.get("/accounts/:accountId", async (req: Request, res: Response) => {
            const accountId = req.params.accountId as string;
            const output = await this.getAccount.execute(accountId);
            res.json(output);
        });

        app.listen(3000);
    }
}
