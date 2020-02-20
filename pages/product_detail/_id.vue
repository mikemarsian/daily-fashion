<template>
  <div class="section">
    <div class="card is-clearfix columns">

      <div class="card-content column is-half">
        <carousel :perPage="1" :autoplay="true" :autoplayHoverPause="true">
          <template v-for="imageSrc in galleryImages">
            <slide>
              <img :src="imageSrc"/>
            </slide>
          </template>
        </carousel>
      </div>

      <div class="card-content column is-half">
        <div class="card-content__title">
          <h2 class="title is-4">{{ product.name }}
          </h2>
        </div>
        <div class="card-content__text">
          <p>
            {{ product.description }}
          </p>
          <div class="content">
            <ul>
              <template v-for="bullet in descBullets">
                <li> {{ bullet }} </li>
              </template>
            </ul>
            <label class="sf-options__label">Material</label>
            <ul>
              <li>{{ this.materialInfoDesc }}</li>
              <li>{{ this.wearInfoDesc }}</li>
            </ul>
            <p>

            </p>
          </div>
        </div>
        <SfDivider />

        <SfOptions
          v-model="colorValue"
          :options="colorOptions['color']"
          :type="'color'"
          :label="'Color'"
          @input="colorSelected"
        />
        <br/>

        <SfOptions
          v-model="materialValue"
          :options="materialOptions['text']"
          :type="'text'"
          :label="'Material'"
          @input="materialSelected"
        />
        <br/>

        <SfOptions
          v-model="sizeValue"
          :options="sizeOptions['text']"
          :type="'text'"
          :label="'Size'"
          @input="sizeSelected"
        />
        <br/>
        <SfAlert :message="this.sizeInfoDesc" :type="'info'" v-if="this.sizeInfoDesc.length > 0"/>

        <div class="card-content__reviews">
          <div class="select is-rounded is-small is-pulled-right">
            <select @change="onSelectQuantity(product.id)"
                    v-model="selectedQuantity"
                    :disabled="noItemsLeft()">
              <option v-for="quantity in this.quantitiesSelect" :value="quantity">{{ quantity }}</option>
            </select>
          </div>
        </div>
        <div class="card-content__price is-pulled-left">
          <SfPrice :regular="'$' + this.product.price * 2"
                   :special="'$' + this.product.price">
          </SfPrice>
        </div>
        <div class="card-content__btn is-pulled-right">
            <button class="button is-primary"
                    v-if="!isAddedBtn"
                    :disabled="noItemsLeft()"
                    @click="cartAdd(product.id)">{{ addToCartLabel }}</button>
            <button class="button is-text" v-if="isAddedBtn" @click="cartRemove(product.id)">{{ removeFromCartLabel }}</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert, SfAddToCart, SfProductOption } from "@storefront-ui/vue";
  import { mapGetters, mapMutations } from 'vuex';
  import { Carousel, Slide } from 'vue-carousel';
  import ProductService from '@/services/ProductService.js';



  export default {

    name: 'product_detail-id',

    validate ({ params }) {
    return /^\d+$/.test(params.id)
  },

    components: {
    SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert, SfAddToCart, SfProductOption,
    Carousel, Slide
  },

    data () {
      return {
        sizeValue: "m",
        sizeOptions: {
          text: []
        },
        colorValue: "",
        colorOptions: {
          color: []
        },
        materialValue: "",
        materialOptions: {
          text: []
        },
        gallerySliderOptions: {
          autoplay: false,
          rewind: true
        },
        materialInfoDesc: "",
        galleryImages: [],
        currentGalleryImage: 1,
        descBullets: "",
        wearInfoDesc: "",
        sizeInfoDesc: "",
        addToCartLabel: 'Add to cart',
        removeFromCartLabel: 'Remove from cart',
        product: {
          bulletDescription: "",
          sizeInfo: "",
          materialInfo: "",
          wearInfo: ""
        },
        productSKU: {
          size: "",
          color: "",
          material: ""
        },
        selectedQuantity: 1,
        skuQuantities: [],
        quantitiesSelect: []
      };
    },

    mounted () {
      this.setProduct();
      console.log(`Loaded product: ${this.product.name}`);

      this.sizeInfoDesc = this.product.sizeInfo.length ? this.getSizeInfos[this.product.sizeInfo] : "";
      this.materialInfoDesc = this.product.materialInfo.length ? this.getMaterialInfos[this.product.materialInfo] : "";
      this.wearInfoDesc = this.product.wearInfo.length ? this.getWearInfos[this.product.wearInfo] : "";
      this.descBullets = this.product.bulletDescription.split('.');
      this.galleryImages = this.getGalleryImages();

      this.loadQuantities();
    },

    computed: {
      isAddedBtn () {
        return this.product.isAddedBtn;
      },
      ...mapGetters(['getProductById', 'getProductSKUsById', 'getSizeInfos', 'getMaterialInfos', 'getWearInfos'])
    },

    methods: {
      setProduct() {
        this.product = this.getProductById(this.$route.params.id);
        this.productSKUs = this.getProductSKUsById(this.$route.params.id);
        this.productSKU = this.productSKUs[0];
        this.sizeValue = this.productSKU.size;
        this.colorValue = this.productSKU.color;
        this.materialValue = this.productSKU.material;
        console.log(`mounted productSKU: ${JSON.stringify(this.productSKU)}`);
      },
      setProductSKU() {
        let foundSKUs = this.productSKUs.filter(sku => {
          return sku.size === this.sizeValue && sku.color === this.colorValue && sku.material == this.materialValue;
        });
        console.log(`setProductSKU to: ${JSON.stringify(foundSKUs[0])}`);
        this.productSKU = foundSKUs[0];
      },
      getGalleryImages() {
        let productImagesArray = [];
        console.log(`Getting ${this.product.galleryImagesCount} gallery images`);
        for(let i = 1; i <= this.product.galleryImagesCount; i++) {
          productImagesArray.push(this.getGalleryImagePath(this.product.id, i));
        }
        return productImagesArray;
      },
      getGalleryImagePath(product_id, index) {
        return require(`~/assets/img/products/${product_id}/gallery/${index}.jpg`)
      },
      noItemsLeft() {
        let status = this.productSKU === undefined ? true : this.quantitiesForSKU(this.productSKU) < 1;
        console.log(`noItemsLeft: ${status}`);
        return status;
      },
      zeroOrOne(max_quantity) {
        return max_quantity > 0 ? 1 : 0;
      },
      quantitiesForSKU(productSKU) {
        let quantities = 0;
        if (!(productSKU === undefined)) {
          quantities = this.skuQuantities[productSKU.id] === undefined ? 0 : this.skuQuantities[productSKU.id]
        }
        console.log(`quantitiesForSKU productSKU=${JSON.stringify(productSKU)}: ***${quantities}***`);
        return quantities;
      },
      setQuantityForSKU(productSKU) {
        this.selectedQuantity = this.zeroOrOne(this.quantitiesForSKU(productSKU));
      },
      setColorOptions(){
        if (!(this.productSKUs === undefined)) {
          let colors = [...new Set(this.productSKUs.map(p => p.color))];
          this.colorOptions.color = this.createOptionsArray(colors, 'color');
          console.log(`Set colorOptions to: ${JSON.stringify(this.colorOptions)}`);
        }
      },
      setMaterialOptions(){
        if (!(this.productSKUs === undefined)) {
          let materials = [...new Set(this.productSKUs.map(p => p.material))];
          this.materialOptions.text = this.createOptionsArray(materials, 'text');
          console.log(`Set materialOptions to: ${JSON.stringify(this.materialOptions)}`);
        }
      },
      setSizeOptions(){
        if (!(this.productSKUs === undefined)) {
          let sizes = [...new Set(this.productSKUs.map(p => p.size))];
          this.sizeOptions.text = this.createOptionsArray(sizes, 'text');
          console.log(`Set sizeOptions to: ${JSON.stringify(this.sizeOptions)}`);
        }
      },
      createOptionsArray(skuPropArray, valuePropName) {
        let options = [];
        skuPropArray.forEach(prop => {
          let option = {
            value: prop,
          };
          option[valuePropName] = prop.charAt(0).toUpperCase() + prop.slice(1);
          options.push(option)
        });
        return options;
      },
      loadQuantities() {
        this.skuQuantities = [];
        console.log(`Getting quantities for ${this.product.name} ...`);

        // load quantities each time, to get the up-to-date stock
        ProductService.getProductQuantities(this.product.id)
          .then(response => {
            console.log(`Got response : ${JSON.stringify((response.data))}`);
            this.skuQuantities = response.data.skuQuantities;
            this.populateQuantitiesSelect();
            this.setQuantityForSKU(this.productSKU);

            console.log(`Setting size options...`);
            this.setSizeOptions();

            console.log(`Setting color options...`);
            this.setColorOptions();

            console.log(`Setting material options...`);
            this.setMaterialOptions();
          })
          .catch(error => {
            console.log('Error:' + error.response)
          });
      },
      populateQuantitiesSelect() {
        this.quantitiesSelect = [];
        for (let i = 1; i <= this.quantitiesForSKU(this.productSKU); i++) {
          this.quantitiesSelect.push(i);
        }
      },
      sizeSelected() {
        this.setProductSKU();
        this.setQuantityForSKU(this.productSKU);
        this.populateQuantitiesSelect();
      },
      colorSelected() {
        console.log(`Selected color: ${this.colorValue}`);
        this.setProductSKU();
      },
      materialSelected() {
        console.log(`Selected material: ${this.materialValue}`);
        this.setProductSKU();
      },
      cartAdd (id) {
        let data = {
          id: id,
          status: true
        };
        this.addToCart(id);
        this.setAddedBtn(data);
      },
      cartRemove (id) {
        let data = {
          id: id,
          status: false
        };
        this.removeFromCart(id);
        this.setAddedBtn(data);
      },
      onSelectQuantity (id) {
        let data = {
          id: id,
          quantity: this.selectedQuantity
        };
        this.quantity(data);
      },
      ...mapMutations(['quantity', 'setAddedBtn', 'addToCart', 'removeFromCart'])
    }
};
</script>

<style lang="scss" scoped>
  .card-content {
    padding: 15px 10px 15px 0;

    &__text {
      margin: 15px 0;
    }
    &__reviews {
      display: inline-block;
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .sf-price {
    font-size: 2rem;
  }

  .sf-alert {
    font-size: 0.8rem;
  }
</style>

