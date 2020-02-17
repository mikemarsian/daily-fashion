<template>
  <div class="section">
    <div class="card is-clearfix columns">

      <div class="card-content column is-half">
        <carousel :perPage="1" :autoplay="false" :autoplayHoverPause="true">
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
          v-model="sizeValue"
          :options="options[sizeType]"
          :type="sizeType"
          :label="sizeLabel"
          @input="sizeSelected"
        />
        <br/>
        <SfAlert :message="this.sizeInfoDesc" :type="'info'" v-if="this.sizeInfoDesc.length > 0"/>

        <div class="card-content__reviews">
          <div class="select is-rounded is-small is-pulled-right">
            <select @change="onSelectQuantity(product.id)"
                    v-model="selectedQuantity"
                    :disabled="noSizesLeft()">
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
<!--            <SfAddToCart-->
<!--              v-if="!isAddedBtn"-->
<!--              v-model="selectedQuantity"-->
<!--              :disabled="noSizesLeft()"-->
<!--              @click="() => {}"-->
<!--              @input="onSelectQuantity(product.id)"-->
<!--            />-->
            <button class="button is-primary"
                    v-if="!isAddedBtn"
                    :disabled="noSizesLeft()"
                    @click="cartAdd(product.id)">{{ addToCartLabel }}</button>
            <button class="button is-text" v-if="isAddedBtn" @click="cartRemove(product.id)">{{ removeFromCartLabel }}</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert, SfAddToCart } from "@storefront-ui/vue";
  import { mapGetters, mapMutations } from 'vuex';
  import { Carousel, Slide } from 'vue-carousel';
  import ProductService from '@/services/ProductService.js';



  export default {

    name: 'product_detail-id',

    validate ({ params }) {
    return /^\d+$/.test(params.id)
  },

    components: {
    SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert, SfAddToCart,
    Carousel, Slide
  },

    data () {
      return {
        descBullets: "",
        sizeValue: "m",
        sizeLabel: "Size",
        sizeType: "text",
        sizeInfoDesc: "",
        gallerySliderOptions: { autoplay: false, rewind: true },
        materialInfoDesc: "",
        galleryImages: [],
        currentGalleryImage: 1,
        wearInfoDesc: "",
        options: {
          text: [
            {value: "xs", text: "XS"},
            {value: "s", text: "S"},
            {value: "m", text: "M"},
            {value: "l", text: "L"},
            {value: "xl", text: "XL"}
          ],
        },
        addToCartLabel: 'Add to cart',
        removeFromCartLabel: 'Remove from cart',
        product: {
          bulletDescription: "",
          sizeInfo: "",
          materialInfo: "",
          wearInfo: ""
        },
        selectedQuantity: 1,
        quantities: [
          {
            "xs": 1,
            "s": 1,
            "m": 1,
            "l": 1,
            "xl": 1
          },
        ],
        quantitiesSelect: []
      };
    },

    mounted () {
      this.setProduct();
      console.log(`Loaded product: ${this.product.name}`);

      console.log(`this.product=${this.product}`);
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
      ...mapGetters(['getProductById', 'getSizeInfos', 'getMaterialInfos', 'getWearInfos'])
    },

    methods: {
      setProduct() {
        this.product = this.getProductById(this.$route.params.id);
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
      noSizesLeft() {
        return this.quantitiesForSize(this.sizeValue) < 1;
      },
      zeroOrOne(max_quantity) {
        return max_quantity > 0 ? 1 : 0;
      },
      quantitiesForSize(size) {
        return this.quantities[size];
      },
      setQuantityForSize(sizeValue) {
        this.selectedQuantity = this.zeroOrOne(this.quantitiesForSize(sizeValue));
      },
      loadQuantities() {
        this.quantities = [];
        console.log(`Getting quantities for ${this.product.name} ...`);
        // load quantities each time, to get the up-to-date stock
        ProductService.getProductQuantities(this.product.id)
          .then(response => {
            console.log(`Got response`);
            this.quantities = response.data.quantities;
            this.populateQuantitiesSelect();
            this.setQuantityForSize(this.sizeValue);
          })
          .catch(error => {
            console.log('Error:' + error.response)
          });
      },
      populateQuantitiesSelect() {
        this.quantitiesSelect = [];
        for (let i = 1; i <= this.quantitiesForSize(this.sizeValue); i++) {
          this.quantitiesSelect.push(i);
        }
      },
      sizeSelected() {
        this.product.size = this.sizeValue;
        console.log("Selected Size: "+ this.product.size);

        this.setQuantityForSize(this.sizeValue);
        this.populateQuantitiesSelect();
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

