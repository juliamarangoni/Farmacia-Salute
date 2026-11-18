
/** @jest-environment jsdom */

const { validarFuncionario } = require("./script");

describe("Testes unitários - Cadastro Farmácia Salute", () => {

    const funcionarioValido = {
        nome: "Julia Marangoni",
        endereco: "Rua 1234, Centro",
        email: "julia@gmail.com",
        telefone: "(35) 99990-9999",
        cargo: "Atendente",
        salario: "2300",
        turno: "Noite"
    };

    // TESTE 1 - Campos obrigatórios
    test("Deve bloquear cadastro com campos vazios", () => {
        const dados = {
            ...funcionarioValido,
            nome: ""
        };

        expect(validarFuncionario(dados))
            .toBe("Preencha todos os campos!");
    });

    // TESTE 2 - Nome com menos de 3 caracteres
    test("Deve bloquear nome com menos de 3 caracteres", () => {
        const dados = {
            ...funcionarioValido,
            nome: "Ju"
        };

        expect(validarFuncionario(dados))
            .toBe("O nome deve ter pelo menos 3 caracteres!");
    });

    // TESTE 3 - Caracteres inválidos no nome
    test("Deve bloquear nome com números ou símbolos inválidos", () => {
        const dados = {
            ...funcionarioValido,
            nome: "Julia123"
        };

        expect(validarFuncionario(dados))
            .toBe("O nome possui caracteres inválidos!");
    });

    // TESTE 4 - Espaços extras no nome
    test("Deve bloquear espaços duplos entre palavras", () => {
        const dados = {
            ...funcionarioValido,
            nome: "Julia  Marangoni"
        };

        expect(validarFuncionario(dados))
            .toBe("Remova os espaços extras do nome!");
    });

    // TESTE 5 - Endereço inválido
    test("Deve bloquear endereço com menos de 8 caracteres", () => {
        const dados = {
            ...funcionarioValido,
            endereco: "Rua 1"
        };

        expect(validarFuncionario(dados))
            .toBe("Digite um endereço válido e completo!");
    });

    // TESTE 6 - E-mail inválido
    test("Deve bloquear e-mail sem formato válido", () => {
        const dados = {
            ...funcionarioValido,
            email: "julia1234.com"
        };

        expect(validarFuncionario(dados))
            .toBe("Digite um e-mail válido!");
    });

    // TESTE 7 - Caracteres inválidos no telefone
    test("Deve bloquear telefone com letras ou caracteres inválidos", () => {
        const dados = {
            ...funcionarioValido,
            telefone: "3599990ABCD"
        };

        expect(validarFuncionario(dados))
            .toBe("O telefone possui caracteres inválidos!");
    });

    // TESTE 8 - Quantidade de números do telefone
    test("Deve bloquear telefone com mais de 11 números", () => {
        const dados = {
            ...funcionarioValido,
            telefone: "123456789101"
        };

        expect(validarFuncionario(dados))
            .toBe("O telefone deve possuir 10 ou 11 números!");
    });

    // TESTE 9 - Cargo inválido
    test("Deve bloquear cargo que não esteja na lista permitida", () => {
        const dados = {
            ...funcionarioValido,
            cargo: "Diretor"
        };

        expect(validarFuncionario(dados))
            .toBe("Selecione um cargo válido!");
    });

    // TESTE 10 - Salário não numérico
    test("Deve bloquear salário com letras", () => {
        const dados = {
            ...funcionarioValido,
            salario: "abc"
        };

        expect(validarFuncionario(dados))
            .toBe("Digite um salário numérico válido!");
    });

    // TESTE 11 - Salário inválido
    test("Deve bloquear salário negativo ou igual a zero", () => {
        const dados = {
            ...funcionarioValido,
            salario: "-0.02"
        };

        expect(validarFuncionario(dados))
            .toBe("O salário deve ser maior que zero!");
    });

    // TESTE 12 - Turno inválido
    test("Deve bloquear turno que não esteja na lista permitida", () => {
        const dados = {
            ...funcionarioValido,
            turno: "Madrugada"
        };

        expect(validarFuncionario(dados))
            .toBe("Selecione um turno válido!");
    });

    // TESTE 13 - Cadastro válido
    test("Deve permitir cadastro com todos os dados válidos", () => {
        expect(validarFuncionario(funcionarioValido))
            .toBeNull();
    });

});
