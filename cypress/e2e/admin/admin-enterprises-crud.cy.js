const modal = () => cy.get(".fixed.inset-0.z-50").last();

const modalField = (label) => modal().contains("label", label).parent();

const enterpriseCard = (name) =>
  cy.contains("p", name).parents(".bg-white.rounded-2xl").first();

const openEnterprisesTab = () => {
  cy.visitAs("/admin", "admin");
  cy.wait(["@getEnterprises", "@getCategories", "@getUsers", "@verifyAuth"]);
  cy.contains("button", "Empreendimentos").click();
  cy.contains("h1", "Empreendimentos").should("be.visible");
};

describe("Admin - empreendimentos", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("cria um empreendimento e atualiza a listagem", () => {
    const createdEnterprise = {
      id: "atelie-luz",
      name: "Atelie Luz",
      category: "Artesanato",
      coverImage: "",
      description: "Produtos artesanais feitos por mulheres da comunidade.",
      fullDescription:
        "O Atelie Luz produz presentes, pecas decorativas e encomendas personalizadas.",
      whatsapp: "5555999911111",
      instagram: "@atelieluz",
      email: "contato@atelieluz.test",
      tags: ["artesanato", "decoracao", "presentes"],
      products: [],
    };

    cy.intercept("POST", "**/api/enterprises", {
      statusCode: 201,
      body: createdEnterprise,
    }).as("createEnterprise");

    openEnterprisesTab();

    cy.contains("button", "Novo empreendimento").click();
    cy.contains("Novo Empreendimento").should("be.visible");

    modalField("Nome do empreendimento")
      .find("input")
      .type("Atelie Luz", { scrollBehavior: "center" });
    modalField("Categoria").find("select").select("Artesanato");
    modal()
      .find("textarea")
      .eq(0)
      .type(createdEnterprise.description, { scrollBehavior: "center" });
    modal()
      .find("textarea")
      .eq(1)
      .type(createdEnterprise.fullDescription, { scrollBehavior: "center" });
    modalField("WhatsApp")
      .find("input")
      .type("5555999911111", { scrollBehavior: "center" });
    modalField("Instagram")
      .find("input")
      .type("@atelieluz", { scrollBehavior: "center" });
    modalField("E-mail")
      .find("input")
      .type("contato@atelieluz.test", { scrollBehavior: "center" });
    modalField("Tags")
      .find("input")
      .type("artesanato, decoracao, presentes", { scrollBehavior: "center" });
    modal().contains("button", "Salvar empreendimento").click();

    cy.wait("@createEnterprise")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          id: "atelie-luz",
          name: "Atelie Luz",
          category: "Artesanato",
          description: createdEnterprise.description,
          fullDescription: createdEnterprise.fullDescription,
          whatsapp: "5555999911111",
          instagram: "@atelieluz",
          email: "contato@atelieluz.test",
        });
        expect(body.tags).to.deep.equal(["artesanato", "decoracao", "presentes"]);
        expect(body.products).to.deep.equal([]);
      });

    cy.contains("Novo Empreendimento").should("not.exist");
    cy.contains("p", "Atelie Luz").should("be.visible");
    cy.contains("Artesanato").should("be.visible");
  });

  it("edita um empreendimento existente", () => {
    cy.fixture("enterprises").then((enterprises) => {
      const updatedEnterprise = {
        ...enterprises[0],
        name: "Costura Criativa Aurora Atualizada",
        description: "Bolsas e ecobags atualizadas para feiras locais.",
        instagram: "@aurora.atualizada",
      };

      cy.intercept("PUT", "**/api/enterprises/aurora", {
        statusCode: 200,
        body: updatedEnterprise,
      }).as("updateEnterprise");
    });

    openEnterprisesTab();

    enterpriseCard("Costura Criativa Aurora").within(() => {
      cy.get('button[title="Editar"]').click();
    });
    cy.contains("Editar: Costura Criativa Aurora").should("be.visible");

    modalField("Nome do empreendimento")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("Costura Criativa Aurora Atualizada", { scrollBehavior: "center" });
    modal()
      .find("textarea")
      .eq(0)
      .clear({ scrollBehavior: "center" })
      .type("Bolsas e ecobags atualizadas para feiras locais.", {
        scrollBehavior: "center",
      });
    modalField("Instagram")
      .find("input")
      .clear({ scrollBehavior: "center" })
      .type("@aurora.atualizada", { scrollBehavior: "center" });
    modal().contains("button", "Salvar empreendimento").click();

    cy.wait("@updateEnterprise")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Costura Criativa Aurora Atualizada",
          description: "Bolsas e ecobags atualizadas para feiras locais.",
          instagram: "@aurora.atualizada",
        });
      });

    cy.contains("Editar: Costura Criativa Aurora").should("not.exist");
    cy.contains("p", "Costura Criativa Aurora Atualizada").should("be.visible");
  });

  it("remove um empreendimento apos confirmacao", () => {
    cy.intercept("DELETE", "**/api/enterprises/sabores", {
      statusCode: 200,
      body: { ok: true },
    }).as("deleteEnterprise");

    openEnterprisesTab();

    enterpriseCard("Sabores do Vale").within(() => {
      cy.get('button[title="Remover"]').click();
    });
    cy.contains('Deseja realmente remover o empreendimento "Sabores do Vale"').should(
      "be.visible",
    );
    cy.contains("button", "Cancelar").click();
    cy.contains("p", "Sabores do Vale").should("be.visible");

    enterpriseCard("Sabores do Vale").within(() => {
      cy.get('button[title="Remover"]').click();
    });
    cy.contains("button", "Confirmar").click();

    cy.wait("@deleteEnterprise").its("request.method").should("eq", "DELETE");
    cy.contains("p", "Sabores do Vale").should("not.exist");
  });
});
