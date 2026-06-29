import { AccountDataDatabase } from "./AccountData.ts";
import { AccountServiceImpl } from "./AccountService.ts";
import API from "./api.ts";

const accountData = new AccountDataDatabase();
// const accountData = new AccountDataFake();
const accountService = new AccountServiceImpl(accountData);
// const accountService = new AccountServiceFake();
const api = new API(accountService);
