# Documentação do Banco de Dados

Este documento descreve as coleções, operações e boas práticas do MongoDB usadas no projeto.

## Coleções e Schemas

### 1. Usuários (`usuarios`)
```typescript
interface Usuario {
  _id: ObjectId;
  nome: string;
  idade: number;
  email: string;
  senha: string; // hash via bcrypt
  tipo: 'ADMIN' | 'USER'; // ou role (compatibilidade)
}
```
Índices recomendados:
- `email`: unique index para buscas rápidas e garantir unicidade

### 2. Produtos (`produtos`)
```typescript
interface Produto {
  _id: ObjectId;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
}
```

### 3. Carrinhos (`carrinhos`)
```typescript
interface Carrinho {
  _id: ObjectId;
  usuarioId: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
  }>;
  dataAtualizacao: Date;
  total: number;
}
```

## Operações Principais

### Autenticação (Login/Usuários)
```javascript
// Buscar usuário por email (login)
const usuario = await db.collection('usuarios').findOne({ email });

// Criar novo usuário
const usuario = { 
  nome, email, 
  senha: await bcrypt.hash(senha, 10),
  tipo: 'USER'
};
await db.collection('usuarios').insertOne(usuario);

// Remover usuário (admin)
await db.collection('usuarios').deleteOne({ 
  _id: ObjectId.createFromHexString(id) 
});
```

### Produtos (CRUD)
```javascript
// Listar todos
await db.collection('produtos').find().toArray();

// Adicionar produto (admin)
await db.collection('produtos').insertOne({
  nome, preco, descricao, urlfoto
});

// Atualizar produto (admin)
await db.collection('produtos').updateOne(
  { _id: ObjectId.createFromHexString(id) },
  { $set: { nome, preco, descricao, urlfoto } }
);
```

### Carrinho
```javascript
// Buscar carrinho do usuário
await db.collection('carrinhos').findOne({ usuarioId });

// Adicionar/atualizar item
await db.collection('carrinhos').updateOne(
  { usuarioId },
  { 
    $set: { 
      itens, total,
      dataAtualizacao: new Date()
    }
  }
);

// Remover carrinho
await db.collection('carrinhos').deleteOne({ usuarioId });
```

## Segurança e Boas Práticas

1. **Senhas**
   - NUNCA armazenar em texto plano
   - Usar bcrypt com salt rounds = 10
   - Validar força da senha no frontend

2. **Índices**
   - Criar índice único em `usuarios.email`
   - Considerar índice em `carrinhos.usuarioId`

3. **Validações**
   - Validar tipos/formatos antes de inserir
   - Sanitizar strings (XSS)
   - Verificar permissões (ADMIN vs USER)

4. **Transações/Atomicidade**
   - Usar updateOne com $set para atualizações atômicas
   - Evitar race conditions em atualizações de carrinho

[Prints do MongoDB Compass/Atlas serão adicionados aqui]
