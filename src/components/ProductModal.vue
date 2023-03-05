<template>
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="!innerProduct.id">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="innerProduct.imageUrl">
              </div>
              <img class="img-fluid" :src="innerProduct.imageUrl" alt="">
            </div>
            <div>
              <h4>多圖設置</h4>
              <!-- 判斷是否為陣列 -->
              <div v-if="Array.isArray(innerProduct.imagesUrl)">
                <template v-for="(img, key) in innerProduct.imagesUrl" :key="key + 1653256">
                  <input type="text" class="form-control" v-model="innerProduct.imagesUrl[key]">
                  <img :src="innerProduct.imagesUrl[key]" alt="" class="img-fluid mb-2">
                </template>
                <!-- 判斷新增、刪除出現的時機 -->
                <!-- 新增的條件:沒有欄位的時候、或是目前欄位是有資料的 -->
                <button class="btn btn-outline-primary btn-sm d-block w-100"
                  v-if="
                  !innerProduct.imagesUrl.length ||
                  innerProduct.imagesUrl[innerProduct.imagesUrl.length - 1]
                  "
                  @click="innerProduct.imagesUrl.push('')">
                  新增圖片
                </button>
                <!-- 刪除的條件:有欄位的時候才能刪除 -->
                <button class="btn btn-outline-danger btn-sm d-block w-100"
                  v-else
                  @click="innerProduct.imagesUrl.pop()">
                  刪除圖片
                </button>
              </div>
              <!-- 當該產品資料沒有屬性 imagesUrl 時，可以新增多圖 -->
              <div v-else>
                <button class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImages">
                  新增圖片
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="innerProduct.title">
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input id="category" type="text" class="form-control" placeholder="請輸入分類" v-model="innerProduct.category">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="innerProduct.unit">
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <!-- 確保原價的值為數字 -->
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="innerProduct.origin_price">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <!-- 確保售價的值為數字 -->
                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價" v-model.number="innerProduct.price">
              </div>
            </div>
            <hr>

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述" v-model="innerProduct.description">
                </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容" v-model="innerProduct.content">
                </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0" v-model="innerProduct.is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="addOrUpdateProduct">
          確認
        </button>
      </div >
    </div >
  </div >
</template>

<script>
export default {
  props: ['tempProduct', 'addOrUpdateProduct', 'createImages'],
  computed: {
    innerProduct () {
      return this.tempProduct
    }
  }
}
</script>
