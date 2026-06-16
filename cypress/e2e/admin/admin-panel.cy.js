describe("Admin - painel", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("abre o painel administrativo para usuario admin", () => {
    cy.visitAs("/admin", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);

    cy.contains("Painel Administrativo").should("be.visible");
    cy.contains("h1", "Visão Geral").should("be.visible");
    cy.contains("Empreendimentos").should("be.visible");
    cy.contains("Produtos").should("be.visible");
    cy.contains("Donos Cadastrados").should("be.visible");

    cy.contains("button", "Empreendimentos").click();
    cy.contains("h1", "Empreendimentos").should("be.visible");
    cy.contains("Costura Criativa Aurora").should("be.visible");

    cy.contains("button", "Categorias").click();
    cy.contains("h1", "Gestão de Categorias").should("be.visible");
    cy.contains("Moda").should("be.visible");

    cy.contains("button", "Usuários").click();
    cy.contains("h1", "Gestão de Usuários").should("be.visible");
    cy.contains("Ana Admin").should("be.visible");
    cy.contains("Olivia Aurora").should("be.visible");
  });
});
