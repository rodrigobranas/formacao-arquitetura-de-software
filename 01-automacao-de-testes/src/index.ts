import express, { type Request, type Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";
import cors from "cors";
import { validateCpf } from "./validateCpf.ts";
import { validateName } from "./validateName.ts";

const app = express();
app.use(express.json());
app.use(cors());

const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

app.post("/signup", async (req: Request, res: Response) => {
    const accountId = crypto.randomUUID();
    const input = req.body;
    if (!validateName(input.name)) {
        return res.json({
            error: "Invalid name"
        });
    }
    if (!input.email.match(/.+@.+\..+/)) {
        return res.json({
            error: "Invalid email"
        });
    }
    if (!validateCpf(input.document)) {
        return res.json({
            error: "Invalid document"
        });
    }
    if (
        input.password.length < 8 || 
        !input.password.match(/[a-z]/) || 
        !input.password.match(/[A-Z]/) || 
        !input.password.match(/[0-9]/)
    ) {
        return res.json({
            error: "Invalid password"
        });
    }
    await connection.query("insert into app.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [accountId, input.name, input.email, input.document, input.password]);
    res.json({
        accountId
    });
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    const [accountData] = await connection.query("select * from app.account where account_id = $1", [accountId]);
    const output = {
        accountId: accountData.account_id,
        name: accountData.name,
        email: accountData.email,
        document: accountData.document,
        password: accountData.password
    }
    res.json(output);
});

app.listen(3000);