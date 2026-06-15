describe("Admin - categorias", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("valida campos obrigatorios ao criar categoria", () => {
    cy.visitAs("/admin", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);

    cy.contains("button", "Categorias").click();
    cy.contains("button", "Nova categoria").click();
    cy.contains("Nova Categoria").should("be.visible");
    cy.contains("button", "Salvar categoria").click();

    cy.contains("Campo obrigatório").should("be.visible");
    cy.contains("Erro!").should("be.visible");
  });
});
