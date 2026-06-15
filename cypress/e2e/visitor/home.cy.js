describe("Visitante - vitrine publica", () => {
  beforeEach(() => {
    cy.stubCatalog();
    cy.visit("/");
    cy.wait(["@getEnterprises", "@getCategories"]);
  });

  it("exibe a home com empreendimentos, filtros e links principais", () => {
    cy.title().should("eq", "Vitrine HUBIS");
    cy.contains("Incubadora Social UFSM").should("be.visible");
    cy.contains("Nossos Empreendimentos").should("be.visible");

    cy.get("#empreendimentos")
      .should("contain", "3 empreendimentos")
      .and("contain", "Costura Criativa Aurora")
      .and("contain", "Sabores do Vale")
      .and("contain", "Verde Vivo");

    cy.contains("button", "Todas").should("be.visible");
    cy.contains("button", "Moda").should("be.visible");
    cy.contains("button", "Alimentação").should("be.visible");
    cy.contains("a", "Login").should("have.attr", "href", "/login");
  });

  it("filtra empreendimentos por termo encontrado em produto ou tag", () => {
    cy.get('input[placeholder="Buscar empreendimentos ou produtos..."]').type(
      "geleia",
    );

    cy.get("#empreendimentos")
      .should("contain", "1 empreendimento")
      .and("contain", "Sabores do Vale")
      .and("not.contain", "Costura Criativa Aurora")
      .and("not.contain", "Verde Vivo");
  });

  it("filtra por categoria e limpa filtros", () => {
    cy.contains("button", "Moda").click();

    cy.get("#empreendimentos")
      .should("contain", "1 empreendimento")
      .and("contain", "Costura Criativa Aurora")
      .and("not.contain", "Sabores do Vale");

    cy.contains("button", "Limpar filtros").click();

    cy.get("#empreendimentos")
      .should("contain", "3 empreendimentos")
      .and("contain", "Sabores do Vale")
      .and("contain", "Verde Vivo");
  });

  it("mostra estado vazio e permite voltar para todos os resultados", () => {
    cy.get('input[placeholder="Buscar empreendimentos ou produtos..."]').type(
      "produto que nao existe",
    );

    cy.contains("Nenhum resultado encontrado").should("be.visible");
    cy.contains("button", "Ver todos os empreendimentos").click();

    cy.get("#empreendimentos")
      .should("contain", "3 empreendimentos")
      .and("contain", "Costura Criativa Aurora");
  });

  it("abre a pagina publica ao clicar em um card", () => {
    cy.contains("a", "Costura Criativa Aurora").click();

    cy.location("pathname").should("eq", "/empreendimento/aurora");
    cy.contains("h1", "Costura Criativa Aurora").should("be.visible");
    cy.contains("Produtos disponíveis").should("be.visible");
  });

  it("exibe menu mobile com as rotas publicas", () => {
    cy.viewport("iphone-x");
    cy.get('button[aria-label="Menu"]').click();

    cy.get("header a:visible")
      .should("contain", "Início")
      .and("contain", "Empreendimentos")
      .and("contain", "UFSM")
      .and("contain", "Login");
  });
});
