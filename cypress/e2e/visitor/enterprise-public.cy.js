const productNames = [
  "Bolsa Floral",
  "Ecobag Bordada",
  "Chaveiro Sem Preco",
];

function visibleProductTitles() {
  return cy.get("h4").then(($titles) =>
    [...$titles]
      .map((title) => title.innerText.trim())
      .filter((title) => productNames.includes(title)),
  );
}

describe("Visitante - pagina publica do empreendimento", () => {
  beforeEach(() => {
    cy.stubCatalog();
  });

  it("exibe dados, produtos, contatos e oculta acoes restritas", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.contains("h1", "Costura Criativa Aurora").should("be.visible");
    cy.contains("Sobre o Empreendimento").should("be.visible");
    cy.contains("Produtos disponíveis").should("be.visible");
    cy.contains("3 produtos").should("be.visible");

    cy.contains("Bolsa Floral").should("be.visible");
    cy.contains("R$ 45,00").should("be.visible");
    cy.contains("Ecobag Bordada").should("be.visible");
    cy.contains("R$ 20,00 a R$ 35,00").should("be.visible");
    cy.contains("Chaveiro Sem Preco").should("be.visible");

    cy.contains("#costura").should("be.visible");
    cy.contains("aurora@example.com").should("be.visible");
    cy.contains("Baixar PDF").should("not.exist");
    cy.contains("a", "Pedir pelo WhatsApp")
      .should("have.attr", "href")
      .and("include", "wa.me/5555999999999");
  });

  it("mantem preco oculto e monta o WhatsApp do produto com mensagem contextual", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.contains("h4", "Chaveiro Sem Preco")
      .parents(".bg-white")
      .first()
      .should("not.contain", "R$ 0,00")
      .and("contain", "Pedir pelo WhatsApp");

    cy.contains("h4", "Bolsa Floral")
      .parents(".bg-white")
      .first()
      .within(() => {
        cy.contains("a", "Pedir pelo WhatsApp")
          .should("have.attr", "href")
          .then((href) => {
            const decodedHref = decodeURIComponent(href);
            expect(decodedHref).to.include("wa.me/5555999999999");
            expect(decodedHref).to.include('produto "Bolsa Floral"');
            expect(decodedHref).to.include("Costura Criativa Aurora");
          });
      });
  });

  it("busca produtos dentro do catalogo do empreendimento", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.get("#product-search").type("ecobag");

    cy.contains("1 de 3").should("be.visible");
    cy.contains("Ecobag Bordada").should("be.visible");
    cy.contains("Bolsa Floral").should("not.exist");

    cy.get('button[aria-label="Limpar busca"]').click();
    cy.contains("3 produtos").should("be.visible");
    cy.contains("Bolsa Floral").should("be.visible");
  });

  it("filtra por faixa de preco e limpa filtros do catalogo", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.get("#product-filter-toggle").click();
    cy.contains("button", /At.*R\$25/).click();

    cy.contains("1 de 3").should("be.visible");
    cy.contains("Ecobag Bordada").should("be.visible");
    cy.contains("Bolsa Floral").should("not.exist");

    cy.contains("button", "Limpar filtros").click();
    cy.contains("3 produtos").should("be.visible");
    cy.contains("Bolsa Floral").should("be.visible");
  });

  it("ordena produtos por menor preco", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.get("#product-sort").select("price-asc");

    visibleProductTitles().should("deep.equal", [
      "Ecobag Bordada",
      "Bolsa Floral",
      "Chaveiro Sem Preco",
    ]);
  });

  it("mostra estado vazio quando nenhum produto corresponde aos filtros", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.get("#product-search").type("produto inexistente");

    cy.contains("Nenhum produto encontrado").should("be.visible");
    cy.contains("button", "Limpar filtros").click();
    cy.contains("Bolsa Floral").should("be.visible");
  });

  it("abre a galeria do produto e navega entre imagens", () => {
    cy.visit("/empreendimento/aurora");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.get('button[aria-label="Ampliar imagem de Bolsa Floral"]').click();
    cy.contains("Foto 1 de 2").should("be.visible");

    cy.get(".fixed").find('button[title="Proxima foto"]').click();
    cy.contains("Foto 2 de 2").should("be.visible");

    cy.get(".fixed").find('button[title="Fechar"]').click();
    cy.contains("Foto 2 de 2").should("not.exist");
  });

  it("exibe mensagem para empreendimento inexistente", () => {
    cy.visit("/empreendimento/desconhecido");
    cy.wait(["@getEnterprises", "@getCategories"]);

    cy.contains("Empreendimento não encontrado").should("be.visible");
    cy.contains("a", "Voltar ao início").click();
    cy.location("pathname").should("eq", "/");
  });
});
