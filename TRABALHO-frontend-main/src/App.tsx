import React, { useState, useEffect } from 'react'
// @ts-ignore
import './App.css'
import api from './api/api'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  descricao: string,
  urlfoto: string
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const [carrinho, setCarrinho] = useState<any>(null)
  const [tipo, setTipo] = useState<string | null>(null)
  const [editing, setEditing] = useState<ProdutoType | null>(null)

  useEffect(() => {
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => {
        if (error.response) {
          console.error(`Servidor respondeu mas com o erro:${error.response.data.mensagem ?? error.response.data}`)
          alert(`Servidor respondeu mas com o erro:${error.response.data.mensagem ?? "olhe o console do navegador para mais informa\u00e7\u00f5es"}`)
        }
        else { //Não teve resposta do servidor, então mostramos o erro do axios.
          console.error(`Erro Axios: ${error.message}`)
          alert(`Servidor não respondeu, voc\u00ea ligou o backend? Erro do Axios: ${error.message ?? "Erro desconhecido"}`)
        }
      })
  }, [])

  useEffect(()=>{
    const t = localStorage.getItem('tipo') || localStorage.getItem('role')
    if(t) setTipo(t.toString().toUpperCase())
  }, [])

  useEffect(()=>{
    // recalcula total localmente sempre que o carrinho mudar
    if(carrinho){
      const total = carrinho.itens.reduce((acc:any, item:any) => acc + item.precoUnitario * item.quantidade, 0)
      setCarrinho({...carrinho, total})
    }
  }, [carrinho?.itens?.length])

  function showError(err:any){
    const msg = err?.response?.data?.mensagem ?? err?.message ?? 'Erro desconhecido'
    alert(msg)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nome = formData.get("nome")
    const preco = Number(formData.get("preco"))
    const descricao = formData.get("descricao")
    const urlfoto = formData.get("urlfoto")
    const produto = { nome, preco, descricao, urlfoto }
    api.post("/produtos", produto)
      .then((response) => setProdutos([...produtos, response.data]))
      .catch((error) => {
        showError(error)
      })
  }

  function adicionarItemCarrinho(produtoId:string){
    api.post("/adicionarItem", {produtoId,quantidade:1})
      .then((r) => { setCarrinho(r.data); alert("Produto adicionado com sucesso!") })
      .catch((error) => showError(error))
  }

  function fetchCarrinho(){
    api.get('/carrinho')
      .then(r=> setCarrinho(r.data))
      .catch(()=> setCarrinho(null))
  }

  function atualizarQuantidade(produtoId:string, quantidade:number){
    api.patch('/carrinho/quantidade', {produtoId, quantidade})
      .then(r=> setCarrinho(r.data))
      .catch((err)=> showError(err))
  }

  function removerItem(produtoId:string){
    api.delete('/carrinho/item', { data: { produtoId } })
      .then(r=> setCarrinho(r.data))
      .catch((err)=> showError(err))
  }

  function esvaziarCarrinho(){
    api.delete('/carrinho')
      .then(()=> { setCarrinho(null); alert('Carrinho esvaziado') })
      .catch((err)=> showError(err))
  }

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('tipo')
    setTipo(null)
    window.location.href = '/login'
  }

  function iniciarEdicao(produto:ProdutoType){
    setEditing(produto)
  }

  function salvarEdicao(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    if(!editing) return
    const formData = new FormData(event.currentTarget)
    const nome = formData.get('nome')
    const preco = Number(formData.get('preco'))
    const descricao = formData.get('descricao')
    const urlfoto = formData.get('urlfoto')
    api.put(`/produtos/${editing._id}`, { nome, preco, descricao, urlfoto })
      .then(r=>{
        setProdutos(produtos.map(p=> p._id === editing._id ? r.data : p))
        setEditing(null)
      })
      .catch(showError)
  }

  function removerProduto(produtoId:string){
    api.delete(`/produtos/${produtoId}`)
      .then(()=> setProdutos(produtos.filter(p=> p._id !== produtoId)))
      .catch(showError)
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Loja</h1>
        <div>
          {tipo ? <span style={{marginRight:8}}>Tipo: {tipo}</span> : null}
          {tipo === 'ADMIN' && (
            <button 
              onClick={() => window.location.href = '/admin'} 
              style={{marginRight:8}}
            >
              Área Admin
            </button>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* show create-product form only to admins */}
      {tipo === 'ADMIN' && (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Nome' name="nome" />
          <input type="number" placeholder='Preço' name="preco" />
          <input type="text" placeholder='Descrição' name="descricao" />
          <input type="text" placeholder='URL Foto' name="urlfoto" />

          <button type='submit'>Cadastrar</button>
        </form>
      )}

      <h2>Lista de produtos</h2>
      <div className="container-produtos">
        {
          produtos.map((produto) => {
            return (
              <div key={produto._id}>
                <h3>{produto.nome}</h3>
                <img src={produto.urlfoto} alt='Imagem do produto' style={{maxWidth:200}}/>
                <p>Preço: R$ {produto.preco}</p>
                <p>Descrição: {produto.descricao}</p>
                <button onClick={()=>adicionarItemCarrinho(produto._id)}>Adicionar ao Carrinho</button>
                {tipo === 'ADMIN' && (
                  <>
                    <button onClick={()=> iniciarEdicao(produto)}>Editar</button>
                    <button onClick={()=> removerProduto(produto._id)}>Remover</button>
                  </>
                )}
              </div>
            )
          })
        }
      </div>

      <h2>Meu Carrinho</h2>
      <div style={{marginBottom:12}}>
        <button onClick={fetchCarrinho}>Atualizar Carrinho</button>
        <button onClick={esvaziarCarrinho} style={{marginLeft:8}}>Esvaziar Carrinho</button>
      </div>

      {carrinho ? (
        <div>
          {carrinho.itens.map((item:any)=> (
            <div key={item.produtoId}>
              <p>{item.nome} - R$ {item.precoUnitario} x {item.quantidade}</p>
              <button onClick={()=> atualizarQuantidade(item.produtoId, Math.max(0, item.quantidade - 1))}>-</button>
              <button onClick={()=> atualizarQuantidade(item.produtoId, item.quantidade + 1)}>+</button>
              <button onClick={()=> removerItem(item.produtoId)}>Remover</button>
            </div>
          ))}
          <p><strong>Total: R$ {carrinho.total}</strong></p>
        </div>
      ) : <p>Sem carrinho</p>}

      {/* modal simples de edição */}
      {editing && (
        <div style={{position:'fixed', left:0, right:0, top:0, bottom:0, background:'rgba(0,0,0,0.3)'}}>
          <div style={{background:'#fff', padding:20, maxWidth:600, margin:'40px auto'}}>
            <h3>Editando: {editing.nome}</h3>
            <form onSubmit={salvarEdicao}>
              <input name="nome" defaultValue={editing.nome} />
              <input name="preco" defaultValue={editing.preco} />
              <input name="descricao" defaultValue={editing.descricao} />
              <input name="urlfoto" defaultValue={editing.urlfoto} />
              <button type='submit'>Salvar</button>
              <button type='button' onClick={()=> setEditing(null)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
