document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://fakestoreapi.com/products';
    const productsPerPage = 4; // Number of products per page
    let currentPage = 1; // Current page number
    let allProducts = []; // Array to store all products
    let filteredProducts = []; // Array to store filtered products

    // Fetch products from API
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data; // Initially display all products
            displayProducts(filteredProducts);
            setupSearch(filteredProducts);
            setupCategoryFilter(filteredProducts);
            setupPriceFilter();
            setupPagination(filteredProducts.length);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayProducts(products) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';

        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        paginatedProducts.forEach(product => {
            const productElement = createProductElement(product);
            productContainer.appendChild(productElement);
        });

        updatePaginationUI(products.length);
    }

    function createProductElement(product) {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.title;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.title;

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addToCart(product));

        productElement.appendChild(productTitle);
        productElement.appendChild(productPrice);
        productElement.appendChild(productImage);
        productElement.appendChild(addToCartButton);

        return productElement;
    }

    function setupSearch(products) {
        const searchInput = document.getElementById('search');

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );

            currentPage = 1; // Reset to the first page when searching
            displayProducts(filteredProducts);
        });
    }

    function setupCategoryFilter(products) {
        const categoryOptions = document.querySelectorAll('.category-option');
        const selectedCategory = document.querySelector('.selected');

        categoryOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const category = option.getAttribute('data-category');
                selectedCategory.innerText = option.innerText;

                filteredProducts = category === 'all'
                    ? products
                    : products.filter(product => product.category === category);

                currentPage = 1; // Reset to the first page when filtering
                displayProducts(filteredProducts);
            });
        });
    }

    function setupPriceFilter() {
        const applyPriceFilterButton = document.getElementById('apply-price-filter');

        applyPriceFilterButton.addEventListener('click', () => {
            const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
            const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

            filteredProducts = allProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);

            currentPage = 1; // Reset to the first page when applying price filter
            displayProducts(filteredProducts);
        });
    }

    function addToCart(product) {
        // Placeholder function for adding product to cart
        console.log('Adding to cart:', product);
        // Implement your cart logic here
        alert(`${product.title} has been added to your cart.`);
    }

    function setupPagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        // Clear existing pagination links
        paginationContainer.innerHTML = '';

        // Create pagination links
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = `#page${i}`;
            pageLink.textContent = i;
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', () => {
                currentPage = i;
                displayProducts(filteredProducts); // Display products for the selected page
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    function updatePaginationUI(totalProducts) {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        // Update page info display
        const pageInfo = document.getElementById('page-info');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        // Update active page link
        const pageLinks = paginationContainer.querySelectorAll('a');
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.textContent === String(currentPage)) {
                link.classList.add('active');
            }
        });
    }
});
