describe("Owner - painel", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("abre o painel do empreendedor para usuario owner", () => {
    cy.visitAs("/painel", "owner");
    cy.wait(["@getEnterprises", "@getCategories", "@verifyAuth"]);

    cy.contains("Meu Painel").should("be.visible");
    cy.contains("Gerencie seu empreendimento e catálogo de produtos").should(
      "be.visible",
    );
    cy.contains("Costura Criativa Aurora").should("be.visible");
    cy.contains("Catálogo de Produtos").should("be.visible");
    cy.contains("Bolsa Floral").should("be.visible");
    cy.contains("button", "Novo produto").should("be.visible");
    cy.contains("button", "QR Code").should("be.visible");
  });

  it("mostra QR Code com link publico do empreendimento do owner", () => {
    cy.visitAs("/painel", "owner");
    cy.wait(["@getEnterprises", "@getCategories", "@verifyAuth"]);

    cy.contains("button", "QR Code").click();

    cy.contains("QR Code da Página Pública").should("be.visible");
    cy.get('input[readonly]')
      .should("have.value", "http://localhost:5173/empreendimento/aurora");
    cy.contains("button", "Copiar").should("be.visible");
  });

  it("sai do painel e limpa o usuario autenticado", () => {
    cy.visitAs("/painel", "owner");
    cy.wait(["@getEnterprises", "@getCategories", "@verifyAuth"]);

    cy.contains("button", "Sair").click();
    cy.location("pathname").should("eq", "/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authUser")).to.eq(null);
    });
  });
});
