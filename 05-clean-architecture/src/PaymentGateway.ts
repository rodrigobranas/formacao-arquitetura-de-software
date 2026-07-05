import axios from "axios";

export default interface PaymentGateway {
    processTransaction (input: Input): Promise<any>;
}

export class PaymentGatewayHttp implements PaymentGateway {

    async processTransaction (input: Input): Promise<any> {
        const [month, year] = input.creditCardExpDate.split("/");
        const creditCard = {
			nome_cartao: input.creditCardHolder,
			numero_cartao: input.creditCardNumber,
			mes_vencimento: month,
			ano_vencimento: year,
			cpf_cartao: "64111456529",
			codigo_cvv: input.creditCardCvv,
			email_cartao: "api@pjbank.com.br"
		};
		const responseCreateToken = await axios({
			url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/tokens`,
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8"
			},
			data: creditCard
		});
        const outputCreateToken = responseCreateToken.data;
		let transaction = {
			pedido_numero: "1",
			token_cartao: outputCreateToken.token_cartao,
			valor: input.amount * 100,
			parcelas: 1,
			descricao_pagamento: ""
		};
		const responseCreateTransaction = await axios({
			url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/transacoes`,
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8"
			},
			data: transaction
		});
        const outputCreateTransaction = responseCreateTransaction.data;
        return outputCreateTransaction;
    }
}

export class PaymentGatewayFake implements PaymentGateway {

    async processTransaction(input: Input): Promise<any> {
        return {
            autorizada: "1"
        }
    }

}

type Input = {
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string,
    amount: number
}
