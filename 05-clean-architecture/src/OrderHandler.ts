import type ExecuteOrder from "./ExecuteOrder.ts";
import type Mediator from "./Mediator.ts";

export default class OrderHandler {

    constructor (readonly mediator: Mediator, readonly executeOrder: ExecuteOrder) {
        mediator.register("orderPlaced", async (event: any) => {
            await executeOrder.execute(event.marketId);
        });
    }
}
