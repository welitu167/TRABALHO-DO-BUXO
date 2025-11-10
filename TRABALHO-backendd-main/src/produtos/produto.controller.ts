import { Request, Response } from 'express';
import { db } from '../database/banco-mongo.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';
import { Collection, ObjectId } from 'mongodb';

interface RequestAuth extends Request {
    tipo?: string;
}

// Adiciona tipagem para collection
interface MongoCollection<T> {
    findOne(query: object): Promise<T | null>;
    find(): { toArray(): Promise<T[]> };
    insertOne(doc: T): Promise<{ insertedId: ObjectId }>;
    updateOne(query: object, update: object): Promise<any>;
    deleteOne(query: object): Promise<any>;
}

interface Produto {
    nome: string;
    preco: number;
    descricao: string;
    urlfoto: string;
}

class ProdutoController {
    private validarProduto(produto: Partial<Produto>) {
        const erros = [];
        if (!produto.nome?.trim()) erros.push('Nome é obrigatório');
        if (!produto.preco || produto.preco <= 0) erros.push('Preço deve ser maior que zero');
        if (!produto.descricao?.trim()) erros.push('Descrição é obrigatória');
        if (!produto.urlfoto?.trim()) erros.push('URL da foto é obrigatória');
        
        if (erros.length > 0) {
            throw new ValidationError('Dados inválidos do produto', erros);
        }
    }

    async adicionar(req: RequestAuth, res: Response) {
        const produto = req.body as Produto;
        this.validarProduto(produto);
        
        const resposta = await db.collection('produtos').insertOne(produto);
        res.status(201).json({ ...produto, _id: resposta.insertedId });
    }

    async listar(req: Request, res: Response) {
        const produtos = await db.collection('produtos').find().toArray();
        res.status(200).json(produtos);
    }

    async atualizar(req: RequestAuth, res: Response) {
        const { id } = req.params;
        if (!id) throw new ValidationError('Id do produto é obrigatório');

        const produto = req.body as Produto;
        this.validarProduto(produto);

        const result = await db.collection('produtos').updateOne(
            { _id: new ObjectId(id) },
            { $set: produto }
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError('Produto não encontrado');
        }

        const produtoAtualizado = await db.collection('produtos').findOne({ _id: new ObjectId(id) });
        return res.status(200).json(produtoAtualizado);
    }

    async remover(req: RequestAuth, res: Response) {
        const { id } = req.params;
        if (!id) throw new ValidationError('Id do produto é obrigatório');

        const result = await db.collection('produtos').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            throw new NotFoundError('Produto não encontrado');
        }

        return res.status(200).json({ mensagem: 'Produto removido com sucesso' });
    }
}
export default new ProdutoController();