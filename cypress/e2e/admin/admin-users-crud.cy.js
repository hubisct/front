const modal = () => cy.get(".fixed.inset-0.z-50").last();

const modalField = (label) => modal().contains("label", label).parent();

const userRow = (name) =>
  cy.contains("p", name).parents(".bg-white.rounded-xl").first();

const openUsersTab = () => {
  cy.visitAs("/admin", "admin");
  cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);
  cy.contains("button", "Usu").click();
  cy.contains("h1", "Gest").should("be.visible");
};

describe("Admin - usuarios", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("cria, edita e remove usuario owner", () => {
    const createdUser = {
      id: "u-owner-teste",
      name: "Bruno Teste",
      email: "bruno@hubis.test",
      password: "senha-segura-123",
      role: "owner",
      enterpriseId: "sabores",
      active: true,
    };

    const updatedUser = {
      ...createdUser,
      name: "Bruno Teste Atualizado",
      email: "bruno.atualizado@hubis.test",
      enterpriseId: "verde-vivo",
    };

    cy.intercept("POST", "**/api/users", {
      statusCode: 201,
      body: createdUser,
    }).as("createUser");
    cy.intercept("PUT", "**/api/users/u-owner-teste", {
      statusCode: 200,
      body: updatedUser,
    }).as("updateUser");
    cy.intercept("DELETE", "**/api/users/u-owner-teste", {
      statusCode: 200,
      body: { ok: true },
    }).as("deleteUser");

    openUsersTab();

    cy.contains("button", "Novo usu").click();
    cy.contains("Cadastrar Usu").should("be.visible");
    modalField("Nome completo")
      .find("input")
      .type("Bruno Teste", { scrollBehavior: "center" });
    modalField("E-mail")
      .find("input")
      .type("bruno@hubis.test", { scrollBehavior: "center" });
    modalField("Senha")
      .find("input")
      .type("senha-segura-123", { scrollBehavior: "center" });
    modalField("Perfil de acesso").find("select").select("owner");
    modalField("Empreendimento vinculado").find("select").select("sabores");
    modal().contains("button", "Salvar usu").click();

    cy.wait("@createUser")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Bruno Teste",
          email: "bruno@hubis.test",
          password: "senha-segura-123",
          role: "owner",
          enterpriseId: "sabores",
          active: true,
        });
      });

    cy.contains("Cadastrar Usu").should("not.exist");
    cy.contains("p", "Bruno Teste").should("be.visible");
    cy.contains("bruno@hubis.test").should("be.visible");
    cy.contains("Sabores do Vale").should("be.visible");

    userRow("Bruno Teste").within(() => {
      cy.get("button").eq(1).click();
    });
    cy.contains("Editar: Bruno Teste").should("be.visible");
    modalField("Nome completo")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("Bruno Teste Atualizado", { scrollBehavior: "center" });
    modalField("E-mail")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("bruno.atualizado@hubis.test", { scrollBehavior: "center" });
    modalField("Senha")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("senha-segura-123", { scrollBehavior: "center" });
    modalField("Empreendimento vinculado").find("select").select("verde-vivo");
    modal().contains("button", "Salvar usu").click();

    cy.wait("@updateUser")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Bruno Teste Atualizado",
          email: "bruno.atualizado@hubis.test",
          password: "senha-segura-123",
          role: "owner",
          enterpriseId: "verde-vivo",
          active: true,
        });
      });

    cy.contains("Editar: Bruno Teste").should("not.exist");
    cy.contains("p", "Bruno Teste Atualizado").should("be.visible");
    cy.contains("bruno.atualizado@hubis.test").should("be.visible");
    cy.contains("Verde Vivo").should("be.visible");

    userRow("Bruno Teste Atualizado").within(() => {
      cy.get("button").eq(2).click();
    });
    cy.contains('Deseja remover o usu').should("be.visible");
    cy.contains("button", "Confirmar").click();

    cy.wait("@deleteUser").its("request.method").should("eq", "DELETE");
    cy.contains("p", "Bruno Teste Atualizado").should("not.exist");
  });
});
