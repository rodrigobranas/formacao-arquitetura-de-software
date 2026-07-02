import { AccountDAODatabase } from "./AccountDAO.ts";
import { AccountServiceImpl } from "./AccountService.ts";
import API from "./api.ts";
import { BalanceDAODatabase } from "./BalanceDAO.ts";
import { PaymentGatewayHttp } from "./PaymentGateway.ts";

const accountDAO = new AccountDAODatabase();
const balanceDAO = new BalanceDAODatabase();
const paymentGateway = new PaymentGatewayHttp();
const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
const api = new API(accountService);
