describe("Auth - sessao e estado autenticado", () => {
  it("redireciona visitantes para o login ao acessar areas restritas", () => {
    cy.stubCatalog();

    cy.visit("/admin");
    cy.location("pathname").should("eq", "/login");

    cy.visit("/painel");
    cy.location("pathname").should("eq", "/login");
  });

  it("avisa quando a sessao expirou", () => {
    cy.stubCatalog();
    cy.visit("/login", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("sessionExpired", "true");
      },
    });

    cy.contains("Sua sessão expirou").should("be.visible");
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("sessionExpired")).to.eq(null);
    });
  });

  it("redireciona usuario ja autenticado no login para o painel correspondente", () => {
    cy.stubCatalog();
    cy.visitAs("/login", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers"]);
    cy.location("pathname").should("eq", "/admin");

    cy.stubCatalog();
    cy.visitAs("/login", "owner");
    cy.wait(["@getEnterprises", "@getCategories"]);
    cy.location("pathname").should("eq", "/painel");
  });

  it("exibe estado autenticado no header publico e permite sair", () => {
    cy.stubCatalog();
    cy.visitAs("/", "admin");
    cy.wait(["@getEnterprises", "@getCategories", "@getUsers"]);

    cy.contains("a", "Painel Admin")
      .should("be.visible")
      .and("have.attr", "href", "/admin");
    cy.contains("Ana").should("be.visible");
    cy.contains("button", "Sair").click();

    cy.location("pathname").should("eq", "/");
    cy.contains("a", "Login").should("be.visible");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authUser")).to.eq(null);
    });
  });

  it("aponta o painel correto para empreendedor autenticado no header publico", () => {
    cy.stubCatalog();
    cy.visitAs("/", "owner");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.contains("a", "Meu Painel")
      .should("be.visible")
      .and("have.attr", "href", "/painel");
    cy.contains("Olivia").should("be.visible");
  });
});
