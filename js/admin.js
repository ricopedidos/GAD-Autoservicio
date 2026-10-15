import { BUSINESS_NAME, formatCurrency, loadJsonProducts } from "./products.js";
import "./cart.js";

const tableBody = document.querySelector("[data-admin-products]");
const searchInput = document.querySelector("[data-admin-search]");
const feedback = document.querySelector("[data-admin-feedback]");
const productCount = document.querySelector("[data-admin-count]");
let products = [];

function renderProducts() {
	const query = searchInput.value.trim().toLocaleLowerCase("es-AR");
	const visibleProducts = products.filter((product) =>
		`${product.name} ${product.barcode} ${product.categoryLabel}`.toLocaleLowerCase("es-AR").includes(query)
	);
	tableBody.replaceChildren();
	if (visibleProducts.length === 0) {
		const row = document.createElement("tr");
		const empty = document.createElement("td");
		empty.colSpan = 4;
		empty.textContent = products.length ? "No hay productos que coincidan con la búsqueda." : "Los archivos JSON no contienen productos.";
		row.append(empty);
		tableBody.append(row);
		return;
	}

	visibleProducts.forEach((product) => {
		const row = document.createElement("tr");
		const name = document.createElement("td");
		name.textContent = product.name;
		const barcode = document.createElement("td");
		barcode.textContent = product.barcode;
		const retail = document.createElement("td");
		retail.textContent = product.retailPrice ? formatCurrency(product.retailPrice) : "Sin cargar";
		const wholesale = document.createElement("td");
		wholesale.textContent = product.wholesalePrice ? formatCurrency(product.wholesalePrice) : "Sin cargar";
		row.append(name, barcode, retail, wholesale);
		tableBody.append(row);
	});
}

document.querySelectorAll("[data-business-name]").forEach((element) => { element.textContent = BUSINESS_NAME; });
searchInput.addEventListener("input", renderProducts);
productCount.textContent = "…";
feedback.textContent = "Cargando precios y productos desde los archivos JSON…";

loadJsonProducts()
	.then((catalog) => {
		products = catalog;
		productCount.textContent = String(products.length);
		feedback.textContent = "Vista de solo lectura. Para actualizar el catálogo, editá los archivos JSON de la raíz del proyecto y volvé a publicarlos.";
		renderProducts();
	})
	.catch((error) => {
		console.error("No se pudieron cargar los archivos del catálogo:", error);
		productCount.textContent = "—";
		feedback.textContent = `No se pudo cargar el catálogo: ${error.message}`;
		feedback.dataset.state = "error";
	});
