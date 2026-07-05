import { AccountRepositoryDatabase } from "./AccountRepository.ts";
import { AccountServiceImpl } from "./AccountService.ts";
import API from "./api.ts";
import { PaymentGatewayHttp } from "./PaymentGateway.ts";

const accountRepository = new AccountRepositoryDatabase();
const paymentGateway = new PaymentGatewayHttp();
const accountService = new AccountServiceImpl(accountRepository, paymentGateway);
const api = new API(accountService);
