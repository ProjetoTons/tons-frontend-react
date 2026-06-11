// API da Lista de Interesse (carrinho de orçamento)
// Backend: br.com.tonspersonalizados.controller.produto.ProdutoController
//  - GET    /produtos/interessados
//  - POST   /produtos/{idProduto}/interesse
//  - DELETE /produtos/{idProduto}/interesse

import { http } from '@/shared/api/http'

// Converte a entidade Produto do backend para o formato consumido pela UI.
export function mapProdutoToItem(produto) {
  if (!produto) return null
  return {
    id: produto.id,
    title: produto.nome ?? 'Produto',
    description: produto.descricao ?? '',
    type: produto.categoriaProduto?.slug ?? produto.tipoMaterial ?? '',
    category: produto.categoriaProduto?.nome ?? produto.tipoMaterial ?? 'Produto',
    image: produto.imagemUrl || produto.image || '/product/placeholder.svg',
  }
}

export async function listarProdutosInteresse() {
  const { data } = await http.get('/produtos/interessados')
  return Array.isArray(data) ? data.map(mapProdutoToItem) : []
}

export async function adicionarProdutoInteresse(idProduto) {
  await http.post(`/produtos/${idProduto}/interesse`)
}

export async function removerProdutoInteresse(idProduto) {
  await http.delete(`/produtos/${idProduto}/interesse`)
}
