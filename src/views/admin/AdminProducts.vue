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
      :get-products="getData"
      >
    </pagination> -->
    <!-- emit -->
    <PaginationComponent
      :pages="page"
      @change-page="getData">
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
    checkUser () {
      this.$http
        .post(`${VITE_URL}v2/api/user/check`)
        .then(() => {
          // 登入後可以取得產品資料
          this.getData()
        })
        .catch((err) => {
          // 若沒登入成功會跳出錯誤訊息並轉址到登入頁面
          alert(err.data.message)
          window.location = 'login.html'
        })
    },
    getData (page = 1) {
      this.$http
        .get(`${VITE_URL}v2/api/${VITE_PATH}/admin/products?page=${page}`)
        .then((res) => {
          // 將資料回傳到本地的 products 陣列
          this.products = res.data.products
          this.page = res.data.pagination
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    viewProduct (product) {
      // 將點擊到的產品存到暫存產品區
      this.tempProduct = product
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
            this.getData()
            this.productModal.hide()
          })
          .catch((err) => {
            alert(err.data.message)
          })
        // 編輯產品
      } else {
        this.$http[method](url, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message)
            this.getData()
            this.productModal.hide()
          })
          .catch((err) => {
            alert(err.data.message)
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
          this.getData()
          this.delProductModal.hide()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    // 當該產品資料沒有屬性 imagesUrl 時，可以新增多圖
    createImages () {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
      console.log('aaa')
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
    // 從 cookie 取回 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    // 往後發送 axios 時，預設將 token 放入 axios 的 headers，打 api 時就不用一直輸入 token
    this.$http.defaults.headers.common.Authorization = token
    // 確認是否登入
    this.checkUser()
    // 建立 bootstrap JS Modal 實體:有兩種建立方式
    // https://getbootstrap.com/docs/5.2/components/modal/#via-javascript
    // const myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
    // or
    // const myModalAlternative = new bootstrap.Modal("#myModal", options);
    this.productModal = new Modal(this.$refs.productModal)
    this.delProductModal = new Modal(this.$refs.delProductModal)
  }
}
</script>
