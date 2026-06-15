const modal = () => cy.get(".fixed.inset-0.z-50").last();

const modalField = (label) => modal().contains("label", label).parent();

const enterpriseCard = (name) =>
  cy.contains("p", name).parents(".bg-white.rounded-2xl").first();

const productRow = (name) =>
  cy.contains("p", name).parents(".bg-white.rounded-xl").first();

const openEnterpriseProducts = () => {
  cy.visitAs("/admin", "admin");
  cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);
  cy.contains("button", "Empreendimentos").click();
  cy.contains("h1", "Empreendimentos").should("be.visible");

  enterpriseCard("Costura Criativa Aurora").within(() => {
    cy.get("button").last().click();
  });
  cy.contains("Produtos (3)").should("be.visible");
};

describe("Admin - produtos", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("cria, edita e remove produto de um empreendimento", () => {
    const createdProduct = {
      id: "produto-teste",
      name: "Carteira Teste",
      description: "Carteira artesanal criada pelo teste.",
      priceMode: "single",
      price: 32.5,
      image: "",
      images: [],
    };

    const updatedProduct = {
      ...createdProduct,
      name: "Carteira Teste Atualizada",
      description: "Carteira artesanal atualizada pelo teste.",
      price: 39.9,
    };

    cy.intercept("POST", "**/api/enterprises/aurora/products", {
      statusCode: 201,
      body: createdProduct,
    }).as("createProduct");
    cy.intercept("PUT", "**/api/enterprises/aurora/products/produto-teste", {
      statusCode: 200,
      body: updatedProduct,
    }).as("updateProduct");
    cy.intercept("DELETE", "**/api/enterprises/aurora/products/produto-teste", {
      statusCode: 200,
      body: { ok: true },
    }).as("deleteProduct");

    openEnterpriseProducts();

    cy.contains("button", "Novo produto").click();
    cy.contains("Novo Produto").should("be.visible");
    modalField("Nome do produto")
      .find("input")
      .type("Carteira Teste", { scrollBehavior: "center" });
    modal()
      .find("textarea")
      .clear({ scrollBehavior: "center" })
      .type("Carteira artesanal criada pelo teste.", {
        scrollBehavior: "center",
      });
    modal()
      .find('input[placeholder="0,00"]')
      .type("32,50", { scrollBehavior: "center" });
    modal().contains("button", "Salvar produto").click();

    cy.wait("@createProduct")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Carteira Teste",
          description: "Carteira artesanal criada pelo teste.",
          priceMode: "single",
          price: 32.5,
          image: "",
        });
        expect(body.images).to.deep.equal([]);
      });

    cy.contains("Novo Produto").should("not.exist");
    cy.contains("p", "Carteira Teste").should("be.visible");
    cy.contains("R$ 32,50").should("be.visible");

    productRow("Carteira Teste").within(() => {
      cy.get("button").first().click();
    });
    cy.contains("Editar: Carteira Teste").should("be.visible");
    modalField("Nome do produto")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("Carteira Teste Atualizada", { scrollBehavior: "center" });
    modal()
      .find("textarea")
      .clear({ scrollBehavior: "center" })
      .type("Carteira artesanal atualizada pelo teste.", {
        scrollBehavior: "center",
      });
    modal()
      .find('input[placeholder="0,00"]')
      .clear({ scrollBehavior: "center" })
      .type("39,90", { scrollBehavior: "center" });
    modal().contains("button", "Salvar produto").click();

    cy.wait("@updateProduct")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Carteira Teste Atualizada",
          description: "Carteira artesanal atualizada pelo teste.",
          priceMode: "single",
          price: 39.9,
        });
      });

    cy.contains("Editar: Carteira Teste").should("not.exist");
    cy.contains("p", "Carteira Teste Atualizada").should("be.visible");
    cy.contains("R$ 39,90").should("be.visible");

    productRow("Carteira Teste Atualizada").within(() => {
      cy.get("button").eq(1).click();
    });
    cy.contains('Deseja remover o produto "Carteira Teste Atualizada"').should(
      "be.visible",
    );
    cy.contains("button", "Confirmar").click();

    cy.wait("@deleteProduct").its("request.method").should("eq", "DELETE");
    cy.contains("p", "Carteira Teste Atualizada").should("not.exist");
  });
});
