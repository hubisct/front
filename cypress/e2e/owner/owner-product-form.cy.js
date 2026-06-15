describe("Owner - formulario de produto", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("valida campos obrigatorios ao cadastrar produto", () => {
    cy.visitAs("/painel", "owner");
    cy.wait(["@getEnterprises", "@getCategories", "@verifyAuth"]);

    cy.contains("button", "Novo produto").click();
    cy.contains("Novo Produto").should("be.visible");
    cy.contains("label", "Nome do produto")
      .parent()
      .find("input")
      .focus()
      .blur();
    cy.contains("Campo obrigatório").should("be.visible");

    cy.contains("button", "Salvar produto").scrollIntoView().click();
    cy.contains("Erro!").should("be.visible");
  });
});
