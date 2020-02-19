export const state = () => ({
  products: [
  ],
  userInfo: {
    isLoggedIn: false,
    isSignedUp: false,
    hasSearched: false,
    name: '',
    productTitleSearched: ''
  },
  systemInfo: {
    openLoginModal: false,
    openSignupModal: false,
    openCheckoutModal: false
  },
  productData: {
    sizeInfos: {
    },
    materialInfos: {
    },
    wearInfos: {

    }
  }
});

export const getters = {
  productsAdded: state => {
    return state.products.filter(el => {
      return el.isAddedToCart;
    });
  },
  getProductById: state => id => {
    return state.products.find(product => product.id == id);
  },
  getProductSKUsById: state => id => {
    return state.productSKUs.find(productSKU => productSKU.id == id).skus;
  },
  isUserLoggedIn: state => {
    return state.userInfo.isLoggedIn;
  },
  isUserSignedUp: state => {
    return state.userInfo.isSignedUp;
  },
  getUserName: state => {
    return state.userInfo.name;
  },
  isLoginModalOpen: state => {
    return state.systemInfo.openLoginModal;
  },
  isSignupModalOpen: state => {
    return state.systemInfo.openSignupModal;
  },
  isCheckoutModalOpen: state => {
    return state.systemInfo.openCheckoutModal;
  },
  quantity: state => {
    return state.products.quantity;
  },
  getSizeInfos: state => {
    return state.productData.sizeInfos;
  },
  getMaterialInfos: state => {
    return state.productData.materialInfos;
  },
  getWearInfos: state => {
    return state.productData.wearInfos;
  }
};

export const mutations = {
  loadProducts: (state, products) => {
    console.log(`Store: storing ${products.length} products`);
    products.forEach(product => {
      product.isAddedToCart = false;
      product.isAddedBtn = false;
    });
    state.products = products;
  },
  loadGeneralProductData: (state, productData) => {
    console.log(`Store: storing product data`);
    state.productData = productData;
  },
  loadProductSKUs: (state, productSKUs) => {
    console.log(`Store: storing product SKUs`);
    state.productSKUs = productSKUs;
  },
  addToCart: (state, id) => {
    state.products.forEach(product => {
      if (id === product.id) {
        console.log(`Store: adding product ${id} to cart`);
        product.isAddedToCart = true;
      }
    });
  },
  setAddedBtn: (state, data) => {
    state.products.forEach(product => {
      if (data.id === product.id) {
        console.log(`Store: setAddedBtn=${data.status} for product ${product.id}`);
        product.isAddedBtn = data.status;
      }
    });
  },
  removeFromCart: (state, id) => {
    state.products.forEach(el => {
      if (id === el.id) {
        el.isAddedToCart = false;
      }
    });
  },
  isUserLoggedIn: (state, isUserLoggedIn) => {
    state.userInfo.isLoggedIn = isUserLoggedIn;
  },
  isUserSignedUp: (state, isSignedUp) => {
    state.userInfo.isSignedUp = isSignedUp;
  },
  setUserName: (state, name) => {
    state.userInfo.name = name;
  },
  showLoginModal: (state, show) => {
    state.systemInfo.openLoginModal = show;
  },
  showSignupModal: (state, show) => {
    state.systemInfo.openSignupModal = show;
  },
  showCheckoutModal: (state, show) => {
    state.systemInfo.openCheckoutModal = show;
  },
  quantity: (state, data) => {
    state.products.forEach(el => {
      if (data.id === el.id) {
        el.quantity = data.quantity;
      }
    });
  }
};
