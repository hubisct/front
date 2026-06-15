Cypress.Commands.add("stubCatalog", () => {
  cy.intercept("GET", "**/api/enterprises*", {
    fixture: "enterprises.json",
  }).as("getEnterprises");

  cy.intercept("GET", "**/api/categories*", {
    fixture: "categories.json",
  }).as("getCategories");

  cy.intercept("GET", "**/api/users*", {
    fixture: "users.json",
  }).as("getUsers");

  cy.intercept("GET", "**/api/auth/verify", {
    statusCode: 200,
    body: { ok: true },
  }).as("verifyAuth");
});

Cypress.Commands.add("visitAs", (path, roleOrEmail = "admin") => {
  cy.fixture("users").then((users) => {
    const user = users.find(
      (candidate) =>
        candidate.role === roleOrEmail || candidate.email === roleOrEmail,
    );

    if (!user) {
      throw new Error(`Usuario de teste nao encontrado: ${roleOrEmail}`);
    }

    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("authUser", JSON.stringify(user));
      },
    });
  });
});

Cypress.Commands.add("fillLogin", (email, password) => {
  cy.get('input[placeholder="seu@email.com"]').clear().type(email);
  cy.get('input[type="password"], input[type="text"]')
    .last()
    .clear()
    .type(password);
});
