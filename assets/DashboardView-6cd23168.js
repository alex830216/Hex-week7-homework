import{_ as l,R as d,a as p,r as a,o as _,c as k,b as o,w as s,d as e,e as i,i as m,F as f}from"./index-290b7e12.js";const{VITE_URL:g}={VITE_URL:"https://vue3-course-api.hexschool.io/",VITE_PATH:"alex-test",BASE_URL:"/Hex-week7-homework/",MODE:"production",DEV:!1,PROD:!0},x={data(){return{}},components:{RouterView:d,RouterLink:p},methods:{logout(){document.cookie='hexToken=""; expires=""',this.$router.push("/login")},checkLogin(){const r=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1");this.$http.defaults.headers.common.Authorization=r,this.$http.post(`${g}v2/api/user/check`).then(()=>{}).catch(()=>{this.$router.push("/login")})}},mounted(){this.checkLogin()}},V=i("div",null,"這是後台頁面",-1);function w(r,c,$,E,L,n){const t=a("router-link"),u=a("routerView");return _(),k(f,null,[V,o(t,{to:"/admin"},{default:s(()=>[e("後台")]),_:1}),e(" | "),o(t,{to:"/admin/orders"},{default:s(()=>[e("訂單列表")]),_:1}),e(" | "),o(t,{to:"/admin/products"},{default:s(()=>[e("產品列表")]),_:1}),e(" | "),o(t,{to:"/"},{default:s(()=>[e("回前台")]),_:1}),e(" | "),i("a",{href:"#",onClick:c[0]||(c[0]=m((...h)=>n.logout&&n.logout(...h),["prevent"]))},"登出"),o(u,{"check-login":n.checkLogin},null,8,["check-login"])],64)}const T=l(x,[["render",w]]);export{T as default};