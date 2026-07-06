# Plataforma de Trading

## Signup (Criar Conta)

Criar a conta do usuário por meio do nome, email, documento e senha. Como resposta, será retornado o identificador da conta. Caso existam problemas de validação, uma mensagem de erro será retornada.

POST /signup
Input: name, email, document, password
Ouput: accountId

- O nome deve ser válido, a regra é ter nome e sobrenome
- O email deve ser válido, a regra é ter @ e terminar com .com ou .com.br
- O documento deve ser válido, seguindo a regra do CPF
- A senha deve ser válida, tendo no mínimo 8 caracteres compostos por letra minúscula, maiúscula e números

#### Deposit (Depósito)

Adicionar fundos em uma conta.

POST /deposit
Input: accountId, assetId, quantity
Output: void

Regras:

- A conta deve existir
- O assetId permitido é USD
- A quantidade deve ser maior que zero

#### Withdraw (Saque)

Retirar fundos de uma conta.

Input: accountId, assetId, quantity
Output: void

Regras:

- A conta deve existir
- O assetId permitido é USD
- A quantidade deve ser maior ou igual ao saldo

#### PlaceOrder (Criar Ordem)

Criar uma ordem de compra ou venda. Neste projeto vamos utilizar o conceito de ordem limitada, ou seja, que só é executada se a quantidade e o preço forem atingidos.

Input: marketId, accountId, side, quantity, price
Output: orderId

Regras:

- Verificar se a conta existe
- Verificar se a conta tem saldo suficiente para comprar ou vender a quantidade de ativos no preço definido na ordem

Observações:

O marketId é composto de um par de ativos (exemplo: BTC-USD). O lado esquerdo é o ativo principal, que está sendo comprado ou vendido, e o lado direito é o ativo utilizado para pagamento. Ou seja, se a ordem for de venda, a conta deve ter saldo no ativo principal, que está sendo negociado, nesse caso BTC. Se a ordem for de compra, a conta deve ter saldo no ativo que está sendo utilizado para o pagamento, nesse caso USD.

A verificação do saldo deve levar em consideração as ordens que estão em aberto, evitando que alguém compra ou venda um ativo duas vezes.

Sempre que uma nova ordem é criada, a plataforma deve tentar executá-la.

#### ExecuteOrder (Executar Ordem)

Quando uma nova ordem é inserida no livro de ofertas, o mecanismo de matching realiza uma tentativa de execução. Esse processo avalia se a ordem pode ser casada imediatamente com ordens do lado oposto.

Regras:

- A ordem de compra com maior preço e a ordem de venda com menor preço são comparadas, caso o preço da ordem de compra seja maior ou igual que o preço da ordem de venda, ela é executada, caso contrário ela permanece no livro de ofertas
- A execução pode ser total ou parcial, conforme ela acontece, a quantidade executada é indicada na ordem até que seja totalmente liquidada
- O preço executado é sempre da ordem mais antiga
- Caso a ordem seja totalmente executada ela é removida do livro de ofertas
- Salvar a ordem atualizada no banco de dados
- Se a ordem for executada uma negociação deve ser criada e persistida
