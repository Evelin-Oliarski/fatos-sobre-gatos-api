// =============================================
//   CatFact Explorer — script.js
//   API: https://catfact.ninja/fact
// =============================================

const API_URL = 'https://catfact.ninja/fact';

// 1. Captura os elementos da pagina
const form        = document.getElementById('meuForm');
const qtdInput    = document.getElementById('qtd');
const erroQtd     = document.getElementById('erroQtd');
const botaoBuscar = document.getElementById('botaoBuscar');
const botaoLimpar = document.getElementById('botaoLimpar');
const loading     = document.getElementById('loading');
const lista       = document.getElementById('lista');
const statTotal   = document.getElementById('stat-total');
const statMaior   = document.getElementById('stat-maior');
const statMedia   = document.getElementById('stat-media');

// Guarda os fatos buscados (no maximo 10)
let fatos = [];

// 2. Escuta o envio do formulario
form.addEventListener('submit', function (evento) {
  evento.preventDefault(); // impede o recarregamento da pagina

  const quantidade = Number(qtdInput.value);

  // 3. Validacao do campo obrigatorio
  if (qtdInput.value === '' || quantidade < 1 || quantidade > 10) {
    qtdInput.classList.add('borda-vermelha');
    erroQtd.innerText = 'Digite um numero de 1 a 10';
    return; // para aqui, nao busca nada
  }

  // Campo valido: limpa o erro e busca os fatos
  qtdInput.classList.remove('borda-vermelha');
  erroQtd.innerText = '';
  buscarFatos(quantidade);
});

// 4. Limpa a lista ao clicar em "Limpar"
botaoLimpar.addEventListener('click', function () {
  fatos = [];
  atualizarEstatisticas();
  mostrarFatos();
});

// 5. Busca os fatos na API
async function buscarFatos(quantidade) {
  loading.hidden = false;
  botaoBuscar.disabled = true;

  try {
    // Uma requisicao GET para cada fato pedido
    for (let i = 0; i < quantidade; i++) {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json(); // { fact: "...", length: N }

      fatos.push({ texto: dados.fact, tamanho: dados.length });
    }

    // Mantem no maximo 10 fatos na lista (descarta os mais antigos)
    if (fatos.length > 10) {
      fatos = fatos.slice(-10);
    }
  } catch (erro) {
    erroQtd.innerText = 'Erro ao buscar os dados. Tente novamente.';
    console.error(erro);
  }

  loading.hidden = true;
  botaoBuscar.disabled = false;

  atualizarEstatisticas();
  mostrarFatos();
}

// 6. Mostra os fatos na tela
function mostrarFatos() {
  botaoLimpar.hidden = fatos.length === 0;

  // Lista vazia
  if (fatos.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🐾</span>
        <p>Nenhum fato buscado ainda.</p>
        <p>Escolha a quantidade e clique em "Buscar fatos".</p>
      </div>
    `;
    return;
  }

  let html = '';

  // Mostra do mais recente para o mais antigo
  for (let i = fatos.length - 1; i >= 0; i--) {
    html += `
      <div class="fact-card">
        <p class="fact-text">${fatos[i].texto}</p>
        <div class="fact-meta">
          <span class="badge">${fatos[i].tamanho} chars</span>
          <span class="badge">fato #${i + 1}</span>
        </div>
      </div>
    `;
  }

  lista.innerHTML = html;
}

// 7. Calcula e exibe as estatisticas
function atualizarEstatisticas() {
  statTotal.innerText = fatos.length;

  if (fatos.length === 0) {
    statMaior.innerText = '—';
    statMedia.innerText = '—';
    return;
  }

  let maior = 0;
  let soma = 0;

  for (let i = 0; i < fatos.length; i++) {
    if (fatos[i].tamanho > maior) {
      maior = fatos[i].tamanho;
    }
    soma += fatos[i].tamanho;
  }

  statMaior.innerText = maior;
  statMedia.innerText = Math.round(soma / fatos.length);
}