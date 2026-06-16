function visitLogin() {
  cy.stubCatalog();
  cy.visit("/login");
  cy.wait(["@getEnterprises", "@getCategories"]);
}

describe("Auth - login", () => {
  it("valida campos obrigatorios e formatos antes de enviar", () => {
    visitLogin();

    cy.get('input[placeholder="seu@email.com"]').focus().blur();
    cy.contains("E-mail obrigatório").should("be.visible");

    cy.get('input[placeholder="seu@email.com"]')
      .clear()
      .type("email-invalido")
      .blur();
    cy.contains("E-mail inválido").should("be.visible");

    cy.get('input[type="password"]').focus().blur();
    cy.contains("Senha obrigatória").should("be.visible");

    cy.get('input[type="password"]').type("curta").blur();
    cy.contains("Senha deve ter ao menos 10 caracteres").should("be.visible");
  });

  it("alterna a visibilidade da senha", () => {
    visitLogin();

    cy.get('input[type="password"]').type("senha-segura");
    cy.get('input[type="password"]')
      .parent()
      .find('button[type="button"]')
      .click();

    cy.get('input[type="text"]').should("have.value", "senha-segura");
  });

  it("mostra mensagem quando as credenciais sao recusadas", () => {
    visitLogin();

    cy.intercept("POST", "**/api/login", {
      statusCode: 401,
      body: { message: "Unauthorized" },
    }).as("login");

    cy.fillLogin("admin@hubis.test", "senha-segura");
    cy.contains("button", "Entrar").click();

    cy.wait("@login")
      .its("request.body")
      .should("deep.equal", {
        email: "admin@hubis.test",
        password: "senha-segura",
      });
    cy.contains("Suas credenciais estão incorretas").should("be.visible");
  });

  it("mostra mensagem generica quando o servidor falha no login", () => {
    visitLogin();

    cy.intercept("POST", "**/api/login", {
      statusCode: 500,
      body: { message: "Internal server error" },
    }).as("login");

    cy.fillLogin("admin@hubis.test", "senha-segura");
    cy.contains("button", "Entrar").click();

    cy.wait("@login");
    cy.contains("Ocorreu um erro ao tentar fazer login").should("be.visible");
    cy.location("pathname").should("eq", "/login");
  });

  it("loga como administrador e redireciona para o painel admin", () => {
    visitLogin();

    cy.fixture("users").then(([admin]) => {
      cy.intercept("POST", "**/api/login", {
        statusCode: 200,
        body: admin,
      }).as("login");
    });

    cy.fillLogin("admin@hubis.test", "senha-segura");
    cy.contains("button", "Entrar").click();

    cy.wait("@login");
    cy.location("pathname").should("eq", "/admin");
    cy.contains("Visão Geral").should("be.visible");
    cy.window()
      .its("localStorage.authUser")
      .then((storedUser) => {
        expect(JSON.parse(storedUser)).to.include({
          email: "admin@hubis.test",
          role: "admin",
        });
      });
  });

  it("loga como empreendedor e redireciona para o painel proprio", () => {
    visitLogin();

    cy.fixture("users").then((users) => {
      const owner = users.find((user) => user.role === "owner");
      cy.intercept("POST", "**/api/login", {
        statusCode: 200,
        body: owner,
      }).as("login");
    });

    cy.fillLogin("aurora@hubis.test", "senha-segura");
    cy.contains("button", "Entrar").click();

    cy.wait("@login");
    cy.location("pathname").should("eq", "/painel");
    cy.contains("Meu Painel").should("be.visible");
    cy.contains("Costura Criativa Aurora").should("be.visible");
  });
});
