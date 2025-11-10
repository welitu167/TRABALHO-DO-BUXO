# Relatório de Consultas - BACKEND

Este relatório documenta as consultas e operações que o backend utiliza no MongoDB.

Operações principais:

1) find()
- Uso: listar documentos que correspondam a um filtro.
- Exemplo: `db.collection('produtos').find().toArray()` — lista todos os produtos.

2) findOne(filter)
- Uso: recuperar um único documento.
- Exemplo: `db.collection('usuarios').findOne({email})` — usado no login para localizar usuário.

3) insertOne(doc)
- Uso: inserir um novo documento.
- Exemplo: `db.collection('usuarios').insertOne(usuario)` — cadastro de usuário.

4) updateOne(filter, update)
- Uso: atualizar campos de um documento.
- Exemplo: `db.collection('carrinhos').updateOne({usuarioId}, {$set:{itens, total}})` — atualizar carrinho.

5) deleteOne(filter)
- Uso: remover um documento.
- Exemplo: `db.collection('produtos').deleteOne({_id: ObjectId.createFromHexString(id)})` — remover produto.

Boas práticas aplicadas:
- Uso de índices: recomenda-se indexar campos frequentemente pesquisados, como `email` em `usuarios` e `usuarioId` em `carrinhos`.
- Tratamento de erros: cada operação do backend retorna mensagens amigáveis em caso de falha.
- Validação mínima: os controladores verificam presença de campos obrigatórios e retornam 400 quando ausentes.

Exemplos de queries com Node.js (mongodb driver):

```js
// encontrar produtos
const produtos = await db.collection('produtos').find().toArray()

// inserir usuario
await db.collection('usuarios').insertOne({nome, email, senha:hash, role:'user'})

// atualizar quantidade no carrinho
await db.collection('carrinhos').updateOne({usuarioId}, {$set:{itens, total}})

// deletar usuario (admin)
await db.collection('usuarios').deleteOne({_id: ObjectId.createFromHexString(id)})
```

Observação: sempre trate ObjectId corretamente quando usar `_id` em filtros.
