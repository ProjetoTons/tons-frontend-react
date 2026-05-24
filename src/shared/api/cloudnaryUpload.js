/**
 * Arquivo: src/shared/api/cloudinaryUpload.js
 * Objetivo: Lidar com o envio de ficheiros para a nuvem do Cloudinary de forma segura (Unsigned).
 */

// Lê APENAS as variáveis públicas permitidas pelo Vite
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Constrói a URL oficial da API do Cloudinary baseada no teu Cloud Name
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Faz upload de uma imagem para o Cloudinary.
 * @param {File} file - O arquivo de imagem selecionado no input HTML.
 * @param {string} folder - (Opcional) A pasta onde a foto será guardada no Cloudinary.
 * @returns {Promise<string>} A URL segura (HTTPS) da imagem pronta a ser usada.
 */
export async function uploadImagem(file, folder = "tons/funcionarios") {
  // Se não houver ficheiro, paramos a execução
  if (!file) throw new Error("Nenhum arquivo fornecido para upload.");

  // O FormData simula um formulário HTML tradicional para envio de ficheiros
  const formData = new FormData();
  formData.append("file", file); // O ficheiro em si
  formData.append("upload_preset", UPLOAD_PRESET); // A permissão pública (Unsigned)
  formData.append("folder", folder); // A organização em pastas

  // Fazemos a requisição POST para o Cloudinary
  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  // Se a requisição falhar, lançamos um erro para o formulário apanhar
  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro?.error?.message || "Falha no upload da imagem.");
  }

  // Se der sucesso, extraímos a resposta e retornamos apenas o link da imagem
  const data = await response.json();
  return data.secure_url;
}