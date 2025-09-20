const menuContainer = document.getElementById("menu");
const categorySelect = document.getElementById("category");
const API_URL = "https://www.themealdb.com/api/json/v1/1/categories.php";
const darkToggle = document.getElementById("darkToggle");

// Load menu from localStorage or fetch
async function loadMenu() {
  let categoriesData = localStorage.getItem("menuCategories");

  if (categoriesData) {
    categoriesData = JSON.parse(categoriesData);
    displayCategories(categoriesData);
  } else {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      localStorage.setItem("menuCategories", JSON.stringify(data.categories));
      displayCategories(data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
      menuContainer.innerHTML = "<p>⚠️ Failed to load menu.</p>";
    }
  }
}

// Display categories in dropdown and menu
function displayCategories(categories) {
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.strCategory;
    option.textContent = cat.strCategory;
    categorySelect.appendChild(option);
  });

  renderMenu(categories);

  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    if (selected === "all") {
      renderMenu(categories);
    } else {
      const filtered = categories.filter(
        (cat) => cat.strCategory === selected
      );
      renderMenu(filtered);
    }
  });
}

// Render menu grid
function renderMenu(categories) {
  menuContainer.innerHTML = "";
  categories.forEach((cat) => {
    const item = document.createElement("div");
    item.classList.add("menu-item");
    item.innerHTML = `
      <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" />
      <div class="menu-info">
        <h3>${cat.strCategory}</h3>
        <p>${cat.strCategoryDescription.slice(0, 100)}...</p>
      </div>
    `;
    menuContainer.appendChild(item);
  });
}

// Dark Mode Toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    darkToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    darkToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// Load theme on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

// Init
loadMenu();
