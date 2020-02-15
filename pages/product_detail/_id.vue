<template>
  <div class="section">
    <div class="card is-clearfix columns">
        <figure class="card-image is-480x480 column is-one-thirds">
          <img src="https://bulma.io/images/placeholders/480x480.png">
        </figure>
        <div class="card-content column is-two-thirds">
          <div class="card-content__title">
            <h2 class="title is-4">{{ product.name }}
            </h2>
          </div>
          <div class="card-content__text">
            <p>
              {{ product.description }}
            </p>
            <div class="content">
              <ul v-for="bullet in descBullets">
                <li> {{ bullet }} </li>
              </ul>
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
                <option v-for="quantity in quantities" :value="quantity">{{ quantity }}</option>
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
                    :disabled="noSizesLeft()"
                    @click="cartAdd(product.id)">{{ addToCartLabel }}</button>
            <button class="button is-text" v-if="isAddedBtn" @click="cartRemove(product.id)">{{ removeFromCartLabel }}</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert } from "@storefront-ui/vue";
  import { mapGetters, mapMutations } from 'vuex';

  export default {
  name: 'product_detail-id',

  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },

  components: {
    SfOptions, SfCharacteristic, SfDivider, SfPrice, SfAlert
  },

  data () {
    return {
      descBullets: "",
      sizeValue: "m",
      sizeLabel: "Size",
      sizeType: "text",
      sizeInfoDesc: "",
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
        quantities: {
          "xs": 1,
          "s": 1,
          "m": 1,
          "l": 1,
          "xl": 1
        },
        sizeInfo: ""
      },
      selectedQuantity: 1,
      quantities: []
    };
  },

  mounted () {
    this.product = this.getProductById(this.$route.params.id);
    console.log(`Loaded product: ${this.product.name}`);

    this.sizeInfoDesc = this.product.sizeInfo.length ? this.getSizeInfos[this.product.sizeInfo] : "";

    this.descBullets = this.product.bulletDescription.split('.');

    this.setQuantityForSize(this.sizeValue);
    this.populateQuantities();
  },

  computed: {
    isAddedBtn () {
      return this.product.isAddedBtn;
    },
    ...mapGetters(['getProductById', 'getSizeInfos'])
  },

  methods: {
    noSizesLeft() {
      return this.quantitiesForSize(this.sizeValue) < 1;
    },
    zeroOrOne(max_quantity) {
      return max_quantity > 0 ? 1 : 0;
    },
    quantitiesForSize(size) {
      return this.product.quantities[size];
    },
    setQuantityForSize(sizeValue) {
      this.selectedQuantity = this.zeroOrOne(this.quantitiesForSize(sizeValue));
    },
    populateQuantities() {
      this.quantities = [];
      for (let i = 1; i <= this.quantitiesForSize(this.sizeValue); i++) {
        this.quantities.push(i);
      }
    },
    sizeSelected() {
      this.product.size = this.sizeValue;
      console.log("Selected Size: "+ this.product.size);

      this.setQuantityForSize(this.sizeValue);
      this.populateQuantities();
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

