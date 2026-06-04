// src/shared/lib/whatsapp.js
// Utilitários para redirecionamento via API oficial wa.me
// Docs: https://faq.whatsapp.com/5913398998672934

/**
 * Retorna o número configurado no .env (VITE_WHATSAPP_NUMERO).
 * Deve conter DDI, sem "+", espaços ou traços.
 */
export function getNumeroWhatsApp() {
  const numero = import.meta.env.VITE_WHATSAPP_NUMERO;
  if (!numero) {
    throw new Error(
      "VITE_WHATSAPP_NUMERO não configurado no .env — defina o número do atendimento."
    );
  }
  return numero;
}

/**
 * Gera a URL oficial de redirecionamento do WhatsApp.
 * @param {string} mensagem - Texto pré-preenchido
 * @returns {string}
 */
export function gerarLinkWhatsApp(mensagem = "") {
  const numero = getNumeroWhatsApp();
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${texto}`;
}

/**
 * Abre o WhatsApp em uma NOVA aba com a mensagem pré-preenchida,
 * mantendo o usuário na página atual.
 * Em desktop abre o WhatsApp Web; em mobile abre o app.
 * @param {string} mensagem
 */
export function redirecionarWhatsApp(mensagem = "") {
  const url = gerarLinkWhatsApp(mensagem);
  // Usar um <a target="_blank"> clicado programaticamente é mais
  // confiável do que window.open (não é bloqueado por popup blockers
  // e nunca navega a aba atual).
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Formata uma lista de produtos em uma mensagem padrão para o atendente.
 * @param {Array<{title: string, category?: string, type?: string}>} itens
 * @param {Object|null} endereco - Endereço do usuário (opcional)
 * @returns {string}
 */
export function formatarListaWhatsApp(itens, endereco = null) {
  if (!itens || itens.length === 0) return "";

  const cabecalho =
    "*Lista de Interesse — Ton's Personalizados*\n\n" +
    "Olá! Gostaria de solicitar um orçamento para os seguintes itens:";

  const lista = itens
    .map((item, i) => {
      const categoria = item.category || item.type || "Produto";
      return `${i + 1}. ${item.title} — ${categoria}`;
    })
    .join("\n");

  let enderecoTexto = "";
  if (endereco && endereco.logradouro) {
    enderecoTexto = "\n\n*Endereço para entrega:*\n";
    enderecoTexto += `${endereco.logradouro}`;
    if (endereco.numero) enderecoTexto += `, ${endereco.numero}`;
    if (endereco.complemento) enderecoTexto += ` — ${endereco.complemento}`;
    enderecoTexto += "\n";
    if (endereco.bairro) enderecoTexto += `${endereco.bairro}`;
    if (endereco.cidade) enderecoTexto += ` — ${endereco.cidade}`;
    if (endereco.estado) enderecoTexto += `/${endereco.estado}`;
    if (endereco.cep) enderecoTexto += `\nCEP: ${endereco.cep}`;
  } else {
    enderecoTexto = "\n\n_Endereço não informado — combinar entrega/retirada._";
  }

  const rodape = `\n\nTotal de itens: ${itens.length}\n\nAguardo retorno!`;

  return `${cabecalho}\n\n${lista}${enderecoTexto}${rodape}`;
}

/**
 * Atalho: monta a mensagem com a lista e redireciona.
 * @param {Array} itens
 * @param {Object|null} endereco - Endereço do usuário (opcional)
 */
export function enviarListaWhatsApp(itens, endereco = null) {
  if (!itens || itens.length === 0) return;
  redirecionarWhatsApp(formatarListaWhatsApp(itens, endereco));
}
