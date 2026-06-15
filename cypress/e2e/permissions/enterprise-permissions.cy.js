describe("Permissoes - empreendimento e paineis", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("controla a exportacao de PDF conforme permissao do usuario", () => {
    cy.visitAs("/empreendimento/aurora", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers"]);
    cy.contains("button", "Baixar PDF").should("be.visible");

    cy.visitAs("/empreendimento/aurora", "owner");
    cy.wait(["@getEnterprises", "@getCategories"]);
    cy.contains("button", "Baixar PDF").should("be.visible");

    cy.visitAs("/empreendimento/sabores", "owner");
    cy.wait(["@getEnterprises", "@getCategories"]);
    cy.contains("button", "Baixar PDF").should("not.exist");
  });

  it("redireciona usuarios autenticados para o painel correto", () => {
    cy.visitAs("/admin", "owner");
    cy.wait(["@getEnterprises", "@getCategories", "@verifyAuth"]);
    cy.location("pathname").should("eq", "/painel");
    cy.contains("Meu Painel").should("be.visible");

    cy.visitAs("/painel", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);
    cy.location("pathname").should("eq", "/admin");
    cy.contains("Painel Administrativo").should("be.visible");
  });
});
