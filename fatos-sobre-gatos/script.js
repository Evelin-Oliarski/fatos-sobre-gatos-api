const form = document.getElementById('form');
const inputTamanho = document.getElementById('tamanhoTexto');
const spanErro = document.getElementById('mensagemErro');
const divResultado = document.getElementById('resultado');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validarNumeroTexto()) {
        buscarFato();
    }
});

inputTamanho.addEventListener('input', function () {
    inputTamanho.classList.remove('borda-vermelha');
    spanErro.textContent = '';
});

function validarNumeroTexto() {
    const valor = Number(inputTamanho.value);

    if (inputTamanho.value === '') {
        inputTamanho.classList.add('borda-vermelha');
        spanErro.textContent = 'Por favor, informe um número antes de enviar.';
        return false;
    }

    if (valor < 20) {
        inputTamanho.classList.add('borda-vermelha');
        spanErro.textContent = 'O texto precisa ter no mínimo 20 caracteres.';
        return false;
    }

    if (valor > 250) {
        inputTamanho.classList.add('borda-vermelha');
        spanErro.textContent = 'O texto pode ter no máximo 250 caracteres.';
        return false;
    }

    inputTamanho.classList.remove('borda-vermelha');
    spanErro.textContent = '';
    return true;
}

async function buscarFato() {
    const tamanho = inputTamanho.value;
    const url = 'https://catfact.ninja/fact?max_length=' + tamanho;

    divResultado.innerHTML = '<p class="carregando">🐾 Buscando fato felino...</p>';

    try {
        const resposta = await fetch(url, { method: 'GET' });

        if (!resposta.ok) {
            throw new Error('Status: ' + resposta.status);
        }

        const dados = await resposta.json();
        exibirFato(dados.fact, dados.length);

    } catch (error) {
        console.error('Falha na comunicação!', error);
        divResultado.innerHTML = '<p class="erroApi">😿 Não foi possível buscar o fato. Tente novamente.</p>';
    }
}

function exibirFato(texto, tamanho) {
    divResultado.innerHTML = `
        <div class="caixa-resultado">
            <p>${texto}</p>
            <p class="tamanho-texto">${tamanho} caractere(s)</p>
        </div>
    `;
}