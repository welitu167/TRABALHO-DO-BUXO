import usuarioController from "../usuarios/usuario.controller.js";
import produtoController from "../produtos/produto.controller.js";
import carrinhoController from "../carrinho/carrinho.controller.js";
import { Router } from "express";
import { adminAuth } from '../middleware/adm.js'

const rotasAutenticadas = Router();

// Rotas de usuários
rotasAutenticadas.post("/usuarios", usuarioController.adicionar);
rotasAutenticadas.get("/usuarios", usuarioController.listar);
// admin delete user
rotasAutenticadas.delete("/usuarios/:id", adminAuth, usuarioController.remover);
// admin explicit routes (aliases) for clarity
rotasAutenticadas.delete('/admin/usuario/:id', adminAuth, usuarioController.remover);
// admin list all carts
rotasAutenticadas.get('/admin/carrinhos', adminAuth, carrinhoController.listarTodos);

// Rotas de produtos (create protected to admin)
rotasAutenticadas.post("/produtos", adminAuth, produtoController.adicionar);
rotasAutenticadas.get("/produtos", produtoController.listar);
// editar e excluir produtos (admin)
rotasAutenticadas.put('/produtos/:id', adminAuth, produtoController.atualizar);
rotasAutenticadas.delete('/produtos/:id', adminAuth, produtoController.remover);

// Rotas de carrinho
rotasAutenticadas.post("/adicionarItem", carrinhoController.adicionarItem);
// adicionar item
rotasAutenticadas.post("/adicionarItem", carrinhoController.adicionarItem);

// obter o carrinho do usuário atual
rotasAutenticadas.get("/carrinho", carrinhoController.listar);

// atualizar quantidade de um item (aceita body { produtoId, quantidade } ou param produtoId)
rotasAutenticadas.put('/carrinho/:produtoId/quantidade', carrinhoController.atualizarQuantidade);
rotasAutenticadas.patch('/carrinho/quantidade', carrinhoController.atualizarQuantidade);

// remover um item do carrinho (por produtoId)
rotasAutenticadas.delete('/carrinho/item', carrinhoController.removerItem); // aceita body
rotasAutenticadas.delete('/carrinho/:itemId', carrinhoController.removerItem); // aceita param

// esvaziar o carrinho do usuário atual
rotasAutenticadas.delete('/carrinho', carrinhoController.remover);

// admin route to remove any user's cart by usuarioId (params)
rotasAutenticadas.delete('/admin/carrinho/:id', adminAuth, carrinhoController.remover);

export default rotasAutenticadas;