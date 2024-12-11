// Dictionary mapping button classes/IDs to descriptions
const tooltipDictionary = {
  "cart-button": "Checkout Cart",
  "gic-wrapper": "Change store locations nearest to you",
  "ld-Search": "Search",
  "ld-Spark": "Home Page",
  "navbar-brand": "Home Page",
  "fa-search": "Search",
  "icon-search": "Search",
  "schedule-online-md": "Click to book an appointment through the website",
  "phone-number": "Call this number to reach us",
  "dropdown-toggle": "Click to view options",
  "nurse-help-line-md": "Dials (713) 338-7979 upon selection",
  "ld-Menu": "Menu",
  "ld-ChevronDown": "Click to view options",
  "linkcard-Shoppets-GridPOVBanners-mediumBanner-contentZone5-tajMHxuR": "Shop for your Pets",
  "linkcard-Shopgifts-GridPOVBanners-tallBanner-contentZone7-qVBsweDL": "Shop for Technology",
  "linkcard-Shopall-AdjustableCardCarousel-contentZone11-SkSQc7RM-card-0": "Holiday Discounts",
  "linkcard-Shopnow-GridPOVBanners-largeBanner-contentZone15-dZNj69TK": "Shop Flash",
  "linkcard-Shopnow-AdjustableCardCarousel-contentZone11-P2jQfMnT-card-2": "Shop Cleaning Devices",
  "linkcard-Shopgifts-GridPOVBanners-smallBanner-contentZone19-VFZuD4DN": "Shop Gifts",
  "linkcard-Shopgifts-GridPOVBanners-mediumBanner-contentZone21-8mKdOFOS": "Shop Gifts",
  "icon-menu-open": "Open Menu",
  "hero-search": "Enter Search Here",
  "card-body": "Press Button to learn more",
  "text-overlay": "Click to learn more",
  "section-list": "Select your needs",
  "quick-links-container": "Immediate help",
  "btn-tertiary": "Click Here",
  "gtranslate_selector": "Pick your language",
  "popular-service": "Select a Service",
  "search-bar": "Enter Search Here",
  "AdjustableCardCarousel": "Scroll to see more",
  "intent-banner-section": "Set your location",
  "Shopnow": "Click to shop"

};

// Function to create tooltip element
function createTooltipElement(text) {
  const tooltip = document.createElement("div");
  tooltip.className = "custom-tooltip";
  tooltip.innerHTML = `
    <span class="text-tooltip">${text}</span>
    <button class="close-tooltip">X</button>
  `;
  return tooltip;
}

// Function to show tooltip with boundary adjustments
function showTooltip(event, text) {
  let tooltip = document.querySelector(".custom-tooltip");
  if (tooltip) tooltip.remove(); // Remove existing tooltip if present

  tooltip = createTooltipElement(text);
  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  // Position tooltip to the right of the element by default
  let top = rect.top + window.scrollY;
  let left = rect.right + 10;

  // Adjust if tooltip overflows to the right
  if (left + tooltipRect.width > window.innerWidth) {
    left = rect.left - tooltipRect.width - 10;
  }

  // Adjust if tooltip overflows at the top or bottom
  if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
    top = window.innerHeight + window.scrollY - tooltipRect.height - 10;
  } else if (top < window.scrollY) {
    top = window.scrollY + 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;

  const closeButton = tooltip.querySelector(".close-tooltip");
  closeButton.addEventListener("click", () => {
    tooltip.remove();
  });
}


// Tooltip functionality
// Event listener for hover and tooltip display
document.addEventListener("mouseover", (event) => {
  //if (switchCheckbox.checked) return; 
  const target = event.target;
  const items = target.id.split("-");
  chrome.storage.sync.get('tooltipEnabled', (data) => {
    if (!data.tooltipEnabled) return;
    
    for (const key in tooltipDictionary) {
      if (target.classList.contains(key) || target.id === key || items.includes(key)  ) {
        showTooltip(event, tooltipDictionary[key]);
        break;
      }
      
    }
  })
});
/*


*/
