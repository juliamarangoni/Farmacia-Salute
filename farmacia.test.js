
/** @jest-environment jsdom */

const fs = require("fs");
const { validarFuncionario, salvarFuncionarioTXT } = require("./farmacia");

describe("Testes Unitários - Farmácia Salute", () => {

    const funcionarioValido = {
        nome: "Julia Santos",
        endereco: "Rua 1234, Centro",
        email: "julia@gmail.com",
        telefone: "(35) 99990-9999",
        cargo: "Atendente",
        salario: "2300",
        turno: "Noite"
    };

    // CT-1 - E-mail inválido
    test("CT-1: Deve bloquear e-mail sem @", () => {
        const dados = {
            ...funcionarioValido,
            email: "julia1234.com"
        };

        expect(validarFuncionario(dados))
            .toBe("Digite um e-mail válido!");
    });

    // CT-2 - Telefone com mais de 11 dígitos
    test("CT-2: Deve bloquear telefone com mais de 11 números", () => {
        const dados = {
            ...funcionarioValido,
            telefone: "123456789101112"
        };

        expect(validarFuncionario(dados))
            .toBe("O telefone deve possuir 10 ou 11 números!");
    });

    // CT-3 - Cargo não selecionado
    test("CT-3: Deve bloquear cadastro sem cargo", () => {
        const dados = {
            ...funcionarioValido,
            cargo: ""
        };

        expect(validarFuncionario(dados))
            .toBe("Preencha todos os campos!");
    });

    // CT-4 - Salário inválido
    describe("CT-4: Validação do salário", () => {

        test("Deve bloquear salário vazio", () => {
            const dados = { ...funcionarioValido, salario: "" };

            expect(validarFuncionario(dados))
                .toBe("Preencha todos os campos!");
        });

        test("Deve bloquear salário não numérico", () => {
            const dados = { ...funcionarioValido, salario: "abc" };

            expect(validarFuncionario(dados))
                .toBe("Digite um salário numérico válido!");
        });

        test("Deve bloquear salário negativo", () => {
            const dados = { ...funcionarioValido, salario: "-0.02" };

            expect(validarFuncionario(dados))
                .toBe("O salário deve ser maior que zero!");
        });

        test("Deve bloquear salário igual a zero", () => {
            const dados = { ...funcionarioValido, salario: "0" };

            expect(validarFuncionario(dados))
                .toBe("O salário deve ser maior que zero!");
        });
    });

    // CT-5 - Endereço com menos de 8 caracteres
    test("CT-5: Deve bloquear endereço incompleto", () => {
        const dados = {
            ...funcionarioValido,
            endereco: "Rua 1"
        };

        expect(validarFuncionario(dados))
            .toBe("Digite um endereço válido e completo!");
    });

    // CT-6 - Espaços duplos no nome
    test("CT-6: Deve bloquear espaços duplos entre palavras", () => {
        const dados = {
            ...funcionarioValido,
            nome: "Julia  Santos"
        };

        expect(validarFuncionario(dados))
            .toBe("Remova os espaços extras do nome!");
    });

    // CT-7 - Cadastro com todos os dados válidos
    test("CT-7: Deve permitir cadastro com dados válidos", () => {
        expect(validarFuncionario(funcionarioValido))
            .toBeNull();
    });

    // CT-8 - Download do arquivo TXT
    test("CT-8: Deve gerar e baixar arquivo TXT com os dados do funcionário", async () => {

        const criarURLOriginal = URL.createObjectURL;
        const revogarURLOriginal = URL.revokeObjectURL;

        const criarURL = jest.fn(() => "blob:teste");
        const revogarURL = jest.fn();

        URL.createObjectURL = criarURL;
        URL.revokeObjectURL = revogarURL;

        const clique = jest.spyOn(
            HTMLAnchorElement.prototype,
            "click"
        ).mockImplementation(() => {});

        salvarFuncionarioTXT(funcionarioValido);

        // Verifica se o Blob foi criado
        expect(criarURL).toHaveBeenCalledTimes(1);

        const arquivo = criarURL.mock.calls[0][0];

        expect(arquivo).toBeInstanceOf(Blob);
        expect(arquivo.type).toBe("text/plain;charset=utf-8");

        // Verifica o conteúdo do arquivo
        const conteudo = await arquivo.text();

        expect(conteudo).toContain("Julia Santos");
        expect(conteudo).toContain("Rua 1234, Centro");
        expect(conteudo).toContain("julia@gmail.com");
        expect(conteudo).toContain("Atendente");
        expect(conteudo).toContain("R$");
        expect(conteudo).toContain("Noite");

        // Verifica se o download foi acionado
        expect(clique).toHaveBeenCalledTimes(1);

        expect(document.querySelector("a").download)
            .toBe("funcionario_julia_santos.txt");

        clique.mockRestore();
        URL.createObjectURL = criarURLOriginal;
        URL.revokeObjectURL = revogarURLOriginal;
    });

    // CT-9 - Seleção de cargo
    test("CT-9: Deve possuir opções de cargos no campo de seleção", () => {

        const html = fs.readFileSync("index.html", "utf8");

        document.body.innerHTML = html;

        const campoCargo = document.getElementById("cargo");

        expect(campoCargo).not.toBeNull();

        const cargos = Array.from(campoCargo.options)
            .map(opcao => opcao.value);

        expect(cargos).toContain("Farmacêutico");
        expect(cargos).toContain("Atendente");
        expect(cargos).toContain("Caixa");
        expect(cargos).toContain("Auxiliar de estoque");
        expect(cargos).toContain("Gerente");
    });

});
