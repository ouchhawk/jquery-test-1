(() => {
    const productUrl = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';
    const localStorageKey = 'productData';
    const favoriteKey = 'favoriteProducts';

    const init = () => {
        fetchProductData().then(products => {
            buildHTML(products);
            buildCSS();
            setEvents();
        }).catch(error => {
            console.error('Failed to fetch product data:', error);
        });
    };

    const fetchProductData = () => {
        return new Promise((resolve, reject) => {
            const localData = localStorage.getItem(localStorageKey);
            if (localData) {
                resolve(JSON.parse(localData));
            } else {
                $.getJSON(productUrl, function(data) {
                    localStorage.setItem(localStorageKey, JSON.stringify(data));
                    resolve(data);
                }).fail(reject);
            }
        });
    };

    const buildHTML = (products) => {
        const html = `
        <div id="we-option-show-more">
            <div class="show-more-carousel">
                <p class="show-more-title">You Might Also Like</p>
                <button class="carousel-button carousel-left-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                </button>
                <div class="show-more-container">
                    
                    <div class="show-more-slider">
                        ${products.map(product => {
                            const isFavorite = JSON.parse(localStorage.getItem(favoriteKey) || '[]').includes(product.id);
                            return `
                                    <div class="show-more-product-card">
                                        <button class="favorite-button ${isFavorite ? 'favorite' : ''}" data-id="${product.id}">&#x2764;</button>
                                        <div class="show-more-card">
                                            <a href="${product.url}" target="_blank">
                                                <img src="${product.img}" alt="${product.name}">
                                            </a>
                                            
                                        </div>
                                        <div class="show-more-product-info">
                                            <a href="${product.url}" target="_blank">${product.name}</a>
                                            <p class="product-price">${product.price} TRY</p>
                                            </div>
                                    </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <button class="carousel-button carousel-right-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                </button>
            </div>
        </div>

        `;

        $('.product-detail').after(html);
    };

    const buildCSS = () => {
        console.log("Building CSS...");
        const css = `
                .show-more-carousel {
                    display: block;
                    width: 80%;
                    margin: auto;
                    position: relative;
                }
    
                .show-more-container {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                }
    
                .show-more-slider {
                    display: flex;
                    transition: transform 1s ease;
                }
    
                img {
                    width: 100%;
                }
    
                .show-more-product-card {
                    width: calc(100% - 10px);
                    min-width: 300px;
                    flex-shrink: 1;
                    position: relative;
                }
    
                .show-more-card {
                    width: calc(100% - 10px);
                }
    
                .show-more-title {
                    font-size: 32px;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: lighter;
                }
        
                .carousel-button{
                    background: white;
                    border: none;
                    position: absolute;
                    top: 50%;
                }

                .carousel-left-button {
                    left: -35px;
                }

                .carousel-right-button {
                    right: -35px;
                    transform: rotate(-180deg);
                }
    
                .favorite-button {
                    background: white;
                    cursor: pointer;
                    font-size: 24px;
                    position: absolute;
                    top: 10px;
                    right: 25px;
                }
    
                .favorite-button.favorite {
                    color: blue;
                }
    
                .product-price {
                    color: #193db0;
                    font-size: 18px;
                    font-weight: bold;
                }

                a:hover {
                    text-decoration: none; 
                }
                        
                @media (max-width: 600px) {
                .show-more-slider {
                    flex-shrink: 0;
                    width: calc(100% - 10px);
                }
    
            `;
    
        $("<style>").addClass("carousel-style").html(css).appendTo("head");
        console.log("CSS built and appended to head");
      };
    
      const setEvents = () => {
        const track = $(".show-more-slider");
        const slides = $(".show-more-product-card");
        const slideWidth = slides.first().outerWidth(true);
        let currentIndex = 0;
    
        $(".carousel-left-button").on("click", () => {
          if (currentIndex > 0) {
            currentIndex--;
            track.css("transform", `translateX(-${currentIndex * slideWidth}px)`);
          }
        });
    
        $(".carousel-right-button").on("click", () => {
          if (currentIndex < slides.length - 6.5) {
            currentIndex++;
            track.css("transform", `translateX(-${currentIndex * slideWidth}px)`);
          }
        });
    
        $(".favorite-button").on("click", function () {
          const productId = $(this).data("id");
          let favorites = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
          if (favorites.includes(productId)) {
            favorites = favorites.filter((id) => id !== productId);
            $(this).removeClass("favorite");
          } else {
            favorites.push(productId);
            $(this).addClass("favorite");
          }
          localStorage.setItem(favoriteKey, JSON.stringify(favorites));
        });
      };
    
      init();
    })();
    