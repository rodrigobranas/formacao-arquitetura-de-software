import { AccountRepositoryDatabase } from "./AccountRepository.ts";
import API from "./api.ts";
import { Deposit } from "./Deposit.ts";
import ExecuteOrder from "./ExecuteOrder.ts";
import { GetAccount } from "./GetAccount.ts";
import GetOrder from "./GetOrder.ts";
import Mediator from "./Mediator.ts";
import { OrderRepositoryDatabase } from "./OrderRepository.ts";
import { PaymentGatewayHttp } from "./PaymentGateway.ts";
import PlaceOrder from "./PlaceOrder.ts";
import { Signup } from "./Signup.ts";

const accountRepository = new AccountRepositoryDatabase();
const orderRepository = new OrderRepositoryDatabase();
const paymentGateway = new PaymentGatewayHttp();
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const deposit = new Deposit(accountRepository, paymentGateway);
const executeOrder = new ExecuteOrder(orderRepository);
const mediator = new Mediator();
mediator.register("orderPlaced", async (event: any) => {
    await executeOrder.execute(event.marketId);
});
const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
const getOrder = new GetOrder(orderRepository);
const api = new API(signup, getAccount, deposit, placeOrder, getOrder);
