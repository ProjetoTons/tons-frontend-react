import { http } from '@/shared/api/http'
import { produtos as mockProdutos } from './mockProdutos'

/**
 * Busca produtos do backend e adapta para o formato do frontend.
 * Fallback: retorna mock em caso de erro.
 */
export async function getProdutos() {
  try {
    const { data } = await http.get('/produtos')
    if (!Array.isArray(data) || data.length === 0) return mockProdutos

    return data.map((p) => ({
      id: p.id,
      title: p.nome,
      category: p.categoriaProduto?.nome || 'Sem categoria',
      type: p.categoriaProduto?.slug || 'outros',
      image: p.imagemUrl || '',
      destaque: p.destaque ?? false,
      descricao: p.descricao || '',
      tipoMaterial: p.tipoMaterial || '',
    }))
  } catch (err) {
    console.warn('Backend indisponível, usando produtos mock.')
    return mockProdutos
  }
}
