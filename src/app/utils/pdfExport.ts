import type { Enterprise } from "../types";
import { getProductPriceLabel } from "./pricing";

export function exportCatalogPDF(enterprise: Enterprise): void {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const html = generateCatalogHTML(enterprise);
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for images to load before printing.
  printWindow.onload = async () => {
    await waitForImagesToLoad(printWindow, 5000);
    printWindow.focus();
    printWindow.print();
  };
}

function waitForImagesToLoad(targetWindow: Window, timeoutMs: number): Promise<void> {
  const images = Array.from(targetWindow.document.images);

  if (images.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settledCount = 0;
    let finished = false;
    let timeoutId: number | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      resolve();
    };

    const settleOne = () => {
      settledCount += 1;
      if (settledCount >= images.length) {
        finish();
      }
    };

    timeoutId = window.setTimeout(finish, timeoutMs);

    images.forEach((image) => {
      if (image.complete) {
        settleOne();
        return;
      }

      image.addEventListener("load", settleOne, { once: true });
      image.addEventListener("error", settleOne, { once: true });
    });
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeText(value?: string): string {
  return escapeHtml((value || "").trim());
}

function sanitizeImageSrc(value?: string): string {
  return escapeHtml((value || "").trim());
}

function generateCatalogHTML(enterprise: Enterprise): string {
  const enterpriseName = sanitizeText(enterprise.name) || "Empreendimento";
  const enterpriseCategory = sanitizeText(enterprise.category) || "Sem categoria";
  const enterpriseDescription = sanitizeText(enterprise.fullDescription || enterprise.description) || "Descrição não informada.";

  const coverImageSrc = sanitizeImageSrc(enterprise.coverImage);
  const coverHTML = coverImageSrc
    ? `<div class="cover-wrapper">
        <img
          class="cover-image"
          src="${coverImageSrc}"
          alt="Imagem de capa de ${enterpriseName}"
          loading="eager"
          onerror="this.style.display='none'; if (this.nextElementSibling) { this.nextElementSibling.style.display='flex'; }"
        />
        <div class="cover-fallback" style="display:none;">Imagem de capa indisponível.</div>
      </div>`
    : `<div class="cover-fallback">Sem imagem de capa cadastrada.</div>`;

  const productsHTML = enterprise.products
    .map((p, i) => {
      const productName = sanitizeText(p.name) || `Produto ${i + 1}`;
      const productDescription = sanitizeText(p.description) || "Sem descrição.";
      const productPriceLabel = getProductPriceLabel(p);
      const productImageSrc = sanitizeImageSrc(p.image);
      const productImageHTML = productImageSrc
        ? `<img
            class="product-image"
            src="${productImageSrc}"
            alt="Imagem do produto ${productName}"
            loading="lazy"
            onerror="this.style.display='none'; if (this.nextElementSibling) { this.nextElementSibling.style.display='flex'; }"
          />
          <div class="product-image-placeholder" style="display:none;">Sem imagem</div>`
        : `<div class="product-image-placeholder">Sem imagem</div>`;

      return `
      <div class="product-row ${i % 2 === 0 ? "even" : "odd"}">
        <div class="product-media">
          ${productImageHTML}
        </div>
        <div class="product-num">${i + 1}</div>
        <div class="product-info">
          <div class="product-name">${productName}</div>
          <div class="product-desc">${productDescription}</div>
        </div>
        ${productPriceLabel ? `<div class="product-price">${sanitizeText(productPriceLabel)}</div>` : ""}
      </div>
    `;
    })
    .join("");

  const contactsItems = [
    enterprise.whatsapp
      ? `<div class="contact-item"><span class="contact-label">WhatsApp:</span> <span>+${sanitizeText(enterprise.whatsapp)}</span></div>`
      : "",
    enterprise.instagram
      ? `<div class="contact-item"><span class="contact-label">Instagram:</span> <span>${sanitizeText(enterprise.instagram)}</span></div>`
      : "",
    enterprise.email
      ? `<div class="contact-item"><span class="contact-label">E-mail:</span> <span>${sanitizeText(enterprise.email)}</span></div>`
      : "",
  ].filter(Boolean);

  const contactsHTML = contactsItems.length > 0
    ? contactsItems.join("")
    : '<div class="contact-empty">Nenhum contato informado.</div>';

  const tagsHTML = enterprise.tags
    .map((t) => `<span class="tag">#${sanitizeText(t)}</span>`)
    .join(" ");

  const today = new Date().toLocaleDateString("pt-BR");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catálogo – ${enterpriseName}</title>
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

    /* COVER */
    .cover-section {
      margin-bottom: 20px;
    }
    .cover-wrapper {
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      overflow: hidden;
      background: #F3F4F6;
    }
    .cover-image {
      display: block;
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
    .cover-fallback {
      width: 100%;
      min-height: 130px;
      border: 1px dashed #D1D5DB;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6B7280;
      font-size: 12px;
      background: #F9FAFB;
      padding: 16px;
    }

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
    .contact-empty {
      color: #9CA3AF;
      font-style: italic;
      font-size: 12px;
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
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      margin-bottom: 6px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .product-row.even { background: #F9F7FF; }
    .product-row.odd { background: #F9FAFB; }
    .product-media {
      width: 82px;
      height: 82px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
      background: #F3F4F6;
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .product-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #9CA3AF;
      font-size: 10px;
      font-weight: 700;
      padding: 8px;
      background: #F9FAFB;
    }
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
    <div class="header-sub">${enterpriseName}</div>
    <div class="header-cat">${enterpriseCategory}</div>
  </div>

  <!-- CONTENT -->
  <div class="content">
    <!-- Cover image -->
    <div class="cover-section">
      ${coverHTML}
    </div>

    <!-- Description -->
    <div class="desc-box">
      <div class="section-title">Sobre o Empreendimento</div>
      <div class="desc-text">${enterpriseDescription}</div>
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
