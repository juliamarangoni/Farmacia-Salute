const formulario = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");
const campoNome = document.getElementById("nome");
const campoTelefone = document.getElementById("telefone");

if (formulario) {
    formulario.noValidate = true;
}

// CARGOS E TURNOS PERMITIDOS
const cargosPermitidos = [
    "Farmacêutico",
    "Atendente",
    "Caixa",
    "Auxiliar de estoque",
    "Gerente"
];

const turnosPermitidos = [
    "Manhã",
    "Tarde",
    "Noite"
];

// REMOVE ESPAÇOS EXTRAS AUTOMATICAMENTE NO NOME
if (campoNome) {
    campoNome.addEventListener("input", function () {
        campoNome.value = campoNome.value
            .replace(/^\s+/, "")
            .replace(/\s{2,}/g, " ");
    });

    campoNome.addEventListener("blur", function () {
        campoNome.value = campoNome.value.trim();
    });
}

// MÁSCARA E LIMITE DE TELEFONE (ATÉ 11 DÍGITOS)
if (campoTelefone) {
    campoTelefone.addEventListener("input", function () {
        const numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11);

        if (numeros.length === 0) {
            campoTelefone.value = "";
        } else if (numeros.length <= 2) {
            campoTelefone.value = `(${numeros}`;
        } else if (numeros.length <= 6) {
            campoTelefone.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        } else if (numeros.length <= 10) {
            campoTelefone.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
        } else {
            campoTelefone.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
        }
    });
}

// FUNÇÃO DE VALIDAÇÃO
function validarFuncionario(dados) {
    const {
        nome,
        endereco,
        email,
        telefone,
        cargo,
        salario,
        turno
    } = dados;

    // 1. Verifica campos obrigatórios
    if (!nome || !endereco || !email || !telefone ||
        !cargo || !salario || !turno) {
        return "Preencha todos os campos!";
    }

    // 2. Verifica tamanho mínimo do nome
    if (nome.length < 3) {
        return "O nome deve ter pelo menos 3 caracteres!";
    }

    // 3. Verifica caracteres permitidos no nome
    if (!/^[\p{L}\s'-]+$/u.test(nome)) {
        return "O nome possui caracteres inválidos!";
    }

    // 4. Verifica espaços extras no nome
    if (nome !== nome.replace(/\s+/g, " ").trim()) {
        return "Remova os espaços extras do nome!";
    }

    // 5. Verifica endereço (mínimo 8 caracteres e precisa ter letras)
    if (endereco.length < 8 || !/[a-zA-ZÀ-ÿ]/.test(endereco)) {
        return "Digite um endereço válido e completo!";
    }

    // 6. Verifica formato do e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return "Digite um e-mail válido!";
    }

    // 7. Verifica caracteres permitidos no telefone
    if (!/^[\d\s()+.-]+$/.test(telefone)) {
        return "O telefone possui caracteres inválidos!";
    }

    // 8. Verifica quantidade de números do telefone (10 ou 11 dígitos)
    const numerosTelefone = telefone.replace(/\D/g, "");

    if (numerosTelefone.length < 10 || numerosTelefone.length > 11) {
        return "O telefone deve possuir 10 ou 11 números!";
    }

    // 9. Verifica se o cargo é permitido
    if (!cargosPermitidos.includes(cargo)) {
        return "Selecione um cargo válido!";
    }

    // 10. Verifica se o salário é numérico
    if (String(salario).trim() === "" || !Number.isFinite(Number(salario))) {
        return "Digite um salário numérico válido!";
    }

    // 11. Verifica se o salário é maior que zero
    if (Number(salario) <= 0) {
        return "O salário deve ser maior que zero!";
    }

    // 12. Verifica se o turno é permitido
    if (!turnosPermitidos.includes(turno)) {
        return "Selecione um turno válido!";
    }

    return null;
}

// CADASTRO E VALIDAÇÕES
if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const cargo = document.getElementById("cargo").value;
        const salario = document.getElementById("salario").value;
        const turnoSelecionado = document.querySelector('input[name="turno"]:checked');

        const dados = {
            nome,
            endereco,
            email,
            telefone,
            cargo,
            salario,
            turno: turnoSelecionado ? turnoSelecionado.value : ""
        };

        mensagem.style.color = "red";

        const erro = validarFuncionario(dados);

        // BLOQUEIA O CADASTRO SE HOUVER ERRO
        if (erro) {
            mensagem.textContent = erro;
            return;
        }

        // CADASTRO APROVADO
        mensagem.style.color = "green";
        mensagem.textContent = "Funcionário cadastrado com sucesso!";

        salvarFuncionarioTXT(dados);
    });

    // LIMPAR MENSAGEM AO LIMPAR FORMULÁRIO
    formulario.addEventListener("reset", function () {
        mensagem.textContent = "";
    });
}

// FUNÇÃO PARA SALVAR OS DADOS DO FUNCIONÁRIO EM TXT
function salvarFuncionarioTXT(dados) {
    const salarioFormatado = Number(dados.salario).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const dataCadastro = new Date().toLocaleString("pt-BR");

    const conteudo =
        "========================================\n" +
        "     FICHA DE CADASTRO DE FUNCIONÁRIO   \n" +
        "========================================\n\n" +
        `Nome completo : ${dados.nome}\n` +
        `Endereço      : ${dados.endereco}\n` +
        `E-mail        : ${dados.email}\n` +
        `Telefone      : ${dados.telefone}\n` +
        `Cargo         : ${dados.cargo}\n` +
        `Salário       : ${salarioFormatado}\n` +
        `Turno         : ${dados.turno}\n` +
        `Data/Hora     : ${dataCadastro}\n\n` +
        "========================================\n";

    const arquivo = new Blob([conteudo], {
        type: "text/plain;charset=utf-8"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(arquivo);

    const nomeArquivo = dados.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

    link.href = url;
    link.download = `funcionario_${nomeArquivo || "cadastro"}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

// EXPORTAÇÃO PARA TESTES UNITÁRIOS (JEST)
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validarFuncionario,
        salvarFuncionarioTXT
    };
}