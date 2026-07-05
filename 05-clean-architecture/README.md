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
