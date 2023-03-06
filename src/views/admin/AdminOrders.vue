<template>
  <div class="container">
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            購買時間
          </th>
          <th width="120">
            Email
          </th>
          <th width="120">
            購買款項
          </th>
          <th width="120">
            應付金額
          </th>
          <th width="120">
            是否付款
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ $filters.date(order.create_at) }}</td>
          <td>{{ order.user.email }}</td>
          <template v-for="product in order.products" :key="product.id">
            <td>{{ product.product.title }}
                數量：{{ product.qty }}
                <!-- 單位 -->
                {{ product.product.unit }}
            </td>
          </template>
          <td>{{ order.total }}</td>
          <td class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              v-model="order.is_paid"
              @change="updateOrder(order)"
            />
            <label class="form-check-label" for="flexCheckDefault">
              <span
                class="text-success"
                v-if="order.is_paid">已付款
              </span>
              <span v-else>未付款</span>
            </label>
            <!-- <span class="text-success" v-if="order.is_paid">已付款</span>
            <span v-else>未付款</span> -->
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit', order)">
                編輯
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', order)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent
      :pages="page"
      @change-page="getOrders">
    </PaginationComponent>
    <!-- Modal -->
    <div id="orderModal" ref="orderModal" class="modal fade" tabindex="-1" aria-labelledby="orderModalLabel"
      aria-hidden="true">
      <OrderModal
        :temp-order="tempOrder"
        :update-order="updateOrder">
      </OrderModal>
    </div>
    <div id="delOrderModal" ref="delOrderModal" class="modal fade" tabindex="-1"
      aria-labelledby="delOrderModalLabel" aria-hidden="true">
      <DelOrderModal
        :temp-order="tempOrder"
        :del-order="delOrder">
      </DelOrderModal>
    </div>
    <!-- Modal -->
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import OrderModal from '@/components/OrderModal.vue'
import DelOrderModal from '@/components/DelOrderModal.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

const { VITE_URL, VITE_PATH } = import.meta.env

export default {
  props: [
    'checkLogin'
  ],
  data () {
    return {
      orders: {},
      tempOrder: {},
      page: {},
      orderModal: {},
      delOrderModal: {}
    }
  },
  methods: {
    getOrders (page = 1) {
      this.$http
        .get(`${VITE_URL}v2/api/${VITE_PATH}/admin/orders?page=${page}`)
        .then((res) => {
          this.orders = res.data.orders
          this.page = res.data.pagination
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    updateOrder (order) {
      this.$http.put(`${VITE_URL}v2/api/${VITE_PATH}/admin/order/${order.id}`, { data: order })
        .then((res) => {
          alert(res.data.message)
          this.getOrders()
          this.orderModal.hide()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    delOrder () {
      this.$http
        .delete(`${VITE_URL}v2/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`, { data: this.tempOrder })
        .then((res) => {
          alert(res.data.message)
          this.getOrders()
          this.delOrderModal.hide()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    openModal (status, order) {
      if (status === 'edit') {
        this.orderModal.show()
        this.tempOrder = { ...order }
      } else if (status === 'delete') {
        this.delOrderModal.show()
        this.tempOrder = { ...order }
      }
    }
  },
  components: {
    OrderModal,
    DelOrderModal,
    PaginationComponent
  },
  mounted () {
    this.checkLogin()
    this.getOrders()
    this.orderModal = new Modal(this.$refs.orderModal)
    this.delOrderModal = new Modal(this.$refs.delOrderModal)
  }
}
</script>
