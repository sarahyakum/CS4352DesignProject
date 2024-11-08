// Dictionary mapping button classes/IDs to descriptions
const tooltipDictionary = {
  "cart-button": "TEST CART DESCRIPTION"
};

// Function to create tooltip element
function createTooltipElement(text) {
  const tooltip = document.createElement("div");
  tooltip.className = "custom-tooltip";
  tooltip.innerHTML = `
    <span>${text}</span>
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

// Event listener for hover and tooltip display
document.addEventListener("mouseover", (event) => {
  const target = event.target;
  for (const key in tooltipDictionary) {
    if (target.classList.contains(key) || target.id === key) {
      showTooltip(event, tooltipDictionary[key]);
      break;
    }
  }
});

