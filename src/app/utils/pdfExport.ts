import type { Enterprise } from "../types";

export function exportCatalogPDF(enterprise: Enterprise): void {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const html = generateCatalogHTML(enterprise);
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for images to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };
}

function generateCatalogHTML(enterprise: Enterprise): string {
  const formatPrice = (p: number) =>
    `R$ ${p.toFixed(2).replace(".", ",")}`;

  const productsHTML = enterprise.products
    .map(
      (p, i) => `
      <div class="product-row ${i % 2 === 0 ? "even" : "odd"}">
        <div class="product-num">${i + 1}</div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.description}</div>
        </div>
        <div class="product-price">${formatPrice(p.price)}</div>
      </div>
    `
    )
    .join("");

  const contactsHTML = [
    enterprise.whatsapp
      ? `<div class="contact-item"><span class="contact-label">WhatsApp:</span> <span>+${enterprise.whatsapp}</span></div>`
      : "",
    enterprise.instagram
      ? `<div class="contact-item"><span class="contact-label">Instagram:</span> <span>${enterprise.instagram}</span></div>`
      : "",
    enterprise.email
      ? `<div class="contact-item"><span class="contact-label">E-mail:</span> <span>${enterprise.email}</span></div>`
      : "",
  ].join("");

  const tagsHTML = enterprise.tags
    .map((t) => `<span class="tag">#${t}</span>`)
    .join(" ");

  const today = new Date().toLocaleDateString("pt-BR");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catálogo – ${enterprise.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #1f2937;
      background: #fff;
      font-size: 13px;
    }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, #7C3AED 0%, #EA580C 100%);
      color: white;
      padding: 28px 36px 24px;
      position: relative;
      overflow: hidden;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #FBBF24, #EA580C);
    }
    .header-brand {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.75);
      margin-bottom: 8px;
    }
    .header-title {
      font-size: 26px;
      font-weight: 900;
      margin-bottom: 4px;
    }
    .header-sub {
      font-size: 13px;
      color: #FBBF24;
      font-weight: 700;
    }
    .header-date {
      position: absolute;
      top: 28px; right: 36px;
      font-size: 10px;
      color: rgba(255,255,255,0.6);
    }
    .header-cat {
      margin-top: 10px;
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: white;
      font-size: 10px;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .content { padding: 28px 36px; }

    /* DESCRIPTION */
    .desc-box {
      background: #F9F7FF;
      border-left: 4px solid #7C3AED;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7C3AED;
      margin-bottom: 6px;
    }
    .desc-text {
      color: #374151;
      line-height: 1.6;
    }

    /* CONTACTS */
    .contacts-section { margin-bottom: 20px; }
    .contacts-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    .contact-item {
      background: #F3F4F6;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
    }
    .contact-label {
      font-weight: 700;
      color: #6B7280;
      margin-right: 4px;
    }
    .divider {
      border: none;
      border-top: 1px solid #E5E7EB;
      margin: 16px 0;
    }

    /* TAGS */
    .tags-section { margin-bottom: 24px; }
    .tag {
      display: inline-block;
      background: #EDE9FE;
      color: #7C3AED;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-right: 6px;
      margin-bottom: 4px;
      border: 1px solid #DDD6FE;
    }

    /* PRODUCTS */
    .products-section { }
    .products-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .products-title {
      font-size: 15px;
      font-weight: 800;
      color: #1E1B4B;
    }
    .products-count {
      background: #FFF7ED;
      color: #EA580C;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #FED7AA;
    }
    .product-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      margin-bottom: 6px;
    }
    .product-row.even { background: #F9F7FF; }
    .product-row.odd { background: #F9FAFB; }
    .product-num {
      width: 26px;
      height: 26px;
      background: #7C3AED;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .product-info { flex: 1; min-width: 0; }
    .product-name {
      font-weight: 800;
      font-size: 13px;
      color: #1E1B4B;
      margin-bottom: 3px;
    }
    .product-desc {
      font-size: 11px;
      color: #6B7280;
      line-height: 1.5;
    }
    .product-price {
      background: linear-gradient(135deg, #7C3AED, #EA580C);
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* EMPTY */
    .no-products {
      text-align: center;
      padding: 30px;
      color: #9CA3AF;
      font-style: italic;
    }

    /* FOOTER */
    .footer {
      background: #1E1B4B;
      color: rgba(255,255,255,0.6);
      padding: 12px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      margin-top: 28px;
    }
    .footer strong { color: white; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .header { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div class="header">
    <div class="header-date">${today}</div>
    <div class="header-brand">Vitrine Social · Incubadora Social UFSM</div>
    <div class="header-title">Catálogo de Produtos</div>
    <div class="header-sub">${enterprise.name}</div>
    <div class="header-cat">${enterprise.category}</div>
  </div>

  <!-- CONTENT -->
  <div class="content">
    <!-- Description -->
    <div class="desc-box">
      <div class="section-title">Sobre o Empreendimento</div>
      <div class="desc-text">${enterprise.fullDescription || enterprise.description}</div>
    </div>

    <!-- Contacts -->
    <div class="contacts-section">
      <div class="section-title">Contatos</div>
      <div class="contacts-grid">${contactsHTML}</div>
    </div>

    ${
      enterprise.tags.length > 0
        ? `<div class="tags-section">
      <div class="section-title">Tags</div>
      <div style="margin-top:8px">${tagsHTML}</div>
    </div>`
        : ""
    }

    <hr class="divider" />

    <!-- Products -->
    <div class="products-section">
      <div class="products-header">
        <div class="products-title">Produtos Disponíveis</div>
        <div class="products-count">${enterprise.products.length} produto${enterprise.products.length !== 1 ? "s" : ""}</div>
      </div>
      ${enterprise.products.length > 0 ? productsHTML : '<div class="no-products">Nenhum produto cadastrado ainda.</div>'}
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span><strong>Incubadora Social UFSM</strong> · Av. Roraima, 1000, Santa Maria/RS</span>
    <span>incubadora@ufsm.br · www.ufsm.br</span>
  </div>
</body>
</html>`;
}
