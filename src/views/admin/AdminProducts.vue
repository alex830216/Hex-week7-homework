<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal('create')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td>
            <span class="text-success" v-if="product.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit',product)">
                編輯
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', product)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- props -->
    <!-- <pagination
      :pages="page"
      :get-products="getProducts"
      >
    </pagination> -->
    <!-- emit -->
    <PaginationComponent
      :pages="page"
      @change-page="getProducts">
    </PaginationComponent>
    <!-- Modal -->
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
      aria-hidden="true">
      <ProductModal
        :temp-product="tempProduct"
        :add-or-update-product="addOrUpdateProduct"
        :create-images="createImages">
      </ProductModal>
    </div>
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
      aria-labelledby="delProductModalLabel" aria-hidden="true">
      <DelProductModal
        :temp-product="tempProduct"
        :del-product="delProduct">
      </DelProductModal>
    </div>
    <!-- Modal -->
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import PaginationComponent from '@/components/PaginationComponent.vue'
import ProductModal from '@/components/ProductModal.vue'
import DelProductModal from '@/components/DelProductModal.vue'

const { VITE_URL, VITE_PATH } = import.meta.env

export default {
  props: [
    'checkLogin'
  ],
  data () {
    return {
      products: [],
      tempProduct: {
        // 一開始沒有 imagesUrl 這個欄位，避免出錯需要加上
        imagesUrl: []
      },
      isNew: false,
      page: {},
      productModal: {},
      delProductModal: {}
    }
  },
  methods: {
    getProducts (page = 1) {
      this.$http
        .get(`${VITE_URL}v2/api/${VITE_PATH}/admin/products?page=${page}`)
        .then((res) => {
          // 將資料回傳到本地的 products 陣列
          this.products = res.data.products
          this.page = res.data.pagination
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    addOrUpdateProduct () {
      let url = `${VITE_URL}v2/api/${VITE_PATH}/admin/product`
      let method = 'post'
      if (!this.isNew) {
        url = `${VITE_URL}v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`
        method = 'put'
      }
      // 新增產品
      if (!this.tempProduct.id) {
        this.$http[method](url, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message)
            this.getProducts()
            this.productModal.hide()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
        // 編輯產品
      } else {
        this.$http[method](url, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message)
            this.getProducts()
            this.productModal.hide()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      }
    },
    // 刪除產品
    delProduct () {
      const url = `${VITE_URL}v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`
      this.$http
        .delete(url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message)
          this.getProducts()
          this.delProductModal.hide()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    // 如果一開始建立產品沒有給圖時，產品資料會沒有 imagesUrl 屬性，需要額外新增才可以新增多圖
    createImages () {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    },
    openModal (status, product) {
      if (status === 'create') {
        this.productModal.show()
        this.isNew = true
        this.tempProduct = {
          imagesUrl: []
        }
      } else if (status === 'edit') {
        this.productModal.show()
        this.isNew = false
        this.tempProduct = { ...product }
      } else if (status === 'delete') {
        this.delProductModal.show()
        this.tempProduct = { ...product }
      }
    }
  },
  components: {
    PaginationComponent,
    ProductModal,
    DelProductModal
  },
  // 一開始進入頁面就做
  mounted () {
    this.checkLogin()
    this.getProducts()
    // 建立 bootstrap JS Modal 實體，用 ref 取代 id
    this.productModal = new Modal(this.$refs.productModal)
    this.delProductModal = new Modal(this.$refs.delProductModal)
  }
}
</script>
