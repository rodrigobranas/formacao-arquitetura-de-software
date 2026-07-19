import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import { sleep } from "../../src/infra/util/sleep.ts";

async function main () {
    const databaseConnection = new PgPromiseAdapter();
    await databaseConnection.query("delete from app.order", []);
    while (true) {
        const data = await databaseConnection.query("select floor(extract(epoch from timestamp))::bigint as time, count(*) as orders from app.order group by time order by time desc limit 10", []);
        console.log(data);
        await sleep(1000);
    }
}

main();
