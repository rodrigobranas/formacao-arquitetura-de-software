import { AccountRepositoryDatabase } from "./AccountRepository.ts";
import API from "./api.ts";
import { Deposit } from "./Deposit.ts";
import { GetAccount } from "./GetAccount.ts";
import { PaymentGatewayHttp } from "./PaymentGateway.ts";
import { Signup } from "./Signup.ts";

const accountRepository = new AccountRepositoryDatabase();
const paymentGateway = new PaymentGatewayHttp();
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const deposit = new Deposit(accountRepository, paymentGateway);
const api = new API(signup, getAccount, deposit);
