(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d3e83308"],{"0481":function(t,e,i){"use strict";var n=i("23e7"),a=i("a2bf"),s=i("7b0b"),c=i("07fa"),o=i("5926"),l=i("65f0");n({target:"Array",proto:!0},{flat:function(){var t=arguments.length?arguments[0]:void 0,e=s(this),i=c(e),n=l(e,0);return n.length=a(n,e,e,i,0,void 0===t?1:o(t)),n}})},1152:function(t,e,i){"use strict";i("9b9f")},"13d5":function(t,e,i){"use strict";var n=i("23e7"),a=i("d58f").left,s=i("a640"),c=i("1212"),o=i("9adc"),l=!o&&c>79&&c<83,r=l||!s("reduce");n({target:"Array",proto:!0,forced:r},{reduce:function(t){var e=arguments.length;return a(this,t,e,e>1?arguments[1]:void 0)}})},1450:function(t,e,i){"use strict";i.d(e,"a",(function(){return a}));var n=i("41cb"),a=function(){return Object(n["f"])().get("api/team/my-game-roles?nopage&custom=0")}},2608:function(t,e,i){},2788:function(t,e,i){},"3d43":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"p-compare-main"},[t.mobile?e("mobile"):e("pc")],1)},a=[],s=(i("caad"),i("d3b7"),i("2532"),i("b0c0"),i("4c53"),function(){var t=this,e=t._self._c;return e("div",{staticClass:"p-compare"},[e("div",{staticClass:"u-title"},[e("div",{staticClass:"u-label"},[t._v("亲友对比")]),e("div",{staticClass:"u-tip"}),e("div",{staticClass:"u-radio"},[e("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":"",clearable:""},on:{change:t.selectTabChange},model:{value:t.selectTab,callback:function(e){t.selectTab=e},expression:"selectTab"}},t._l(t.selectOptions,(function(t){return e("el-option",{key:t.value,attrs:{label:t.name,value:t.value}})})),1)],1)]),e("div",{staticClass:"m-main"},[e("div",{staticClass:"u-left"},t._l(t.menuList,(function(i,n){return e("ul",{key:n,staticClass:"u-zl-item",class:{active:i.sub==t.activeIndex,show:i.sub==t.activeIndex&&!t.activeShow},on:{click:function(e){return t.setActiveIndex(i.sub)}}},[e("div",{staticClass:"u-zl-item_title"},[t._v(" "+t._s(i.name)+" "),e("i",{class:i.sub==t.activeIndex&&t.activeShow?"el-icon-caret-top":"el-icon-caret-bottom",on:{click:function(e){return e.stopPropagation(),t.setActiveShow(i.sub)}}})]),t._l(i.children,(function(n,a){return e("li",{key:a,staticClass:"u-zl-item_children",class:{active:n.detail==t.activeIndexChildren},on:{click:function(e){return e.stopPropagation(),t.setActiveIndex(i.sub,n.detail)}}},[t._v(" "+t._s(n.name)+" ")])}))],2)})),0),e("div",{staticClass:"u-right"},[e("div",{staticClass:"u-zl-box"},[e("div",{staticClass:"u-zl_table",style:"width:"+200*(t.contrastKith.length+1)+"px"},[e("div",{staticClass:"u-table_label ps"},[t._v("成就名称")]),t._l(t.contrastKith,(function(i,n){return e("div",{key:n,staticClass:"u-table_label kith"},[e("div",{staticClass:"u-name",attrs:{title:i.name+"·"+i.server}},[t._v(" "+t._s(i.name)+"·"+t._s(i.server)+" ")]),e("i",{staticClass:"el-icon-circle-close",on:{click:function(e){return t.delRole(i,n)}}})])}))],2),e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.achievementsLoading,expression:"achievementsLoading"}],staticClass:"u-zl_cell",style:"width:"+200*(t.contrastKith.length+1)+"px"},[e("div",{staticClass:"u-zl-list ps"},t._l(t.achievements,(function(i,n){return e("div",{key:n,staticClass:"u-zl-list_item"},[e("el-tooltip",{attrs:{effect:"dark",content:i.Desc,placement:"top"}},[e("a",{attrs:{href:t.get_link(i.ID),target:"_blank"}},[e("div",{staticClass:"u-zl-list_item_box"},[e("img",{staticClass:"u-icon",attrs:{src:t.icon_url(null===i||void 0===i?void 0:i.IconID)}}),e("span",{staticClass:"u-name"},[t._v(t._s(null===i||void 0===i?void 0:i.Name))])])])])],1)})),0),t._l(t.contrastKith,(function(i,n){return e("div",{key:n,staticClass:"u-zl-list"},t._l(i.achievements,(function(t,i){return e("div",{key:i,staticClass:"u-zl-list_item kith"},[e("div",{staticClass:"u-self-checked",class:{finish:"-1"!=t.value}},[e("i",{staticClass:"el-icon-check"})])])})),0)}))],2)]),e("div",{staticClass:"u-zl-add_item",on:{click:t.addRole}},[e("i",{staticClass:"el-icon-circle-plus-outline u-add-icon"}),e("div",[t._v("添加角色")])])])]),e("el-dialog",{attrs:{title:"添加角色",visible:t.showAddRole,width:"420px",draggable:"","close-on-click-modal":!1},on:{"update:visible":function(e){t.showAddRole=e}}},[e("el-form",{ref:"roleRef",attrs:{model:t.kithForm,rules:t.rules}},[e("el-form-item",{attrs:{label:"角色类型",prop:"roleType"}},[e("el-radio-group",{on:{input:function(e){t.kithForm.userId="",t.kithForm.jx3Id=""}},model:{value:t.kithForm.roleType,callback:function(e){t.$set(t.kithForm,"roleType",e)},expression:"kithForm.roleType"}},[e("el-radio",{attrs:{label:"1"}},[t._v("自身")]),e("el-radio",{attrs:{label:"2"}},[t._v("亲友")])],1)],1),2==t.kithForm.roleType?e("el-form-item",{attrs:{label:"我的亲友",prop:"uid"}},[e("el-select",{attrs:{placeholder:"请选择"},on:{change:t.getKithRolesList},model:{value:t.kithForm.uid,callback:function(e){t.$set(t.kithForm,"uid",e)},expression:"kithForm.uid"}},t._l(t.myKith,(function(t,i){var n;return e("el-option",{key:i,attrs:{label:(null===t||void 0===t||null===(n=t.kith_info)||void 0===n?void 0:n.display_name)||"-",value:t.kith_id}})})),1)],1):t._e(),e("el-form-item",{attrs:{label:"对应角色",prop:"jx3Id"}},[e("el-select",{attrs:{placeholder:"请选择对应角色"},on:{change:t.setRoleInfo},model:{value:t.kithForm.jx3Id,callback:function(e){t.$set(t.kithForm,"jx3Id",e)},expression:"kithForm.jx3Id"}},t._l(1==t.kithForm.roleType?t.roleList:t.myKithRoles,(function(t,i){return e("el-option",{key:i,attrs:{label:t.name,value:t.jx3id}})})),1)],1)],1),e("div",{staticClass:"u-tips"},[e("div",[e("i",{staticClass:"el-icon-info"}),t._v(" 提示")]),t._v(" 1. 添加亲友角色后，可对比亲友角色与自身角色的成就进度。"),e("br"),t._v(" 2. 去"),e("a",{attrs:{href:"https://www.jx3box.com/dashboard/privacy?tab=whitelist",target:"_blank"}},[t._v("添加亲友")])]),e("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.showAddRole=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.addRoleConfirm}},[t._v("确 定")])],1)],1)],1)}),c=[],o=i("2909"),l=i("53ca"),r=i("5530"),u=(i("4de4"),i("7db0"),i("0481"),i("d81d"),i("14d9"),i("13d5"),i("a434"),i("4069"),i("25f0"),i("6062"),i("1e70"),i("79a4"),i("c1a1"),i("8b00"),i("a4e7"),i("1e5a"),i("72c3"),i("3ca3"),i("0643"),i("2382"),i("fffc"),i("4e3e"),i("a573"),i("9d4a"),i("159b"),i("ddb0"),i("262e")),h=i("c967"),d=i("85e4"),v=i("c9d2"),f=i("1450"),m=i("2ef0"),p={components:{},data:function(){return{currentRole:{},menuList:[],selectTab:"",selectOptions:[{name:"共同未完成的",value:1}],activeIndex:1,activeShow:!0,activeIndexChildren:null,achievements:[],achievements_bak:[],achievementsLoading:!1,showAddRole:!1,myKith:[],myKithRoles:[],roleList:[],kithForm:{uid:"",jx3Id:""},rules:{roleType:{required:!0,message:"请选择类型",trigger:"change"},uid:{required:!0,message:"请选择亲友",trigger:"change"},jx3Id:{required:!0,message:"请选择角色",trigger:"change"}},contrastKith:[],contrastKith_bak:[]}},created:function(){this.loadUserRoles()},mounted:function(){},methods:{get_link:function(t){return Object(d["f"])("achievement",t)},icon_url:function(t){return Object(d["k"])(t)},setActiveShow:function(t){this.activeIndex!=t?this.setActiveIndex(t):this.activeShow=!this.activeShow},setActiveIndex:function(t,e){this.achievementsLoading||(this.activeIndex==t||e||(this.activeShow=!0),this.activeIndex=t,this.activeIndexChildren=e||null,this.getMenuAchievements(t,e))},getList:function(){var t=this;Object(u["i"])({general:1,client:this.$store.state.client}).then((function(e){var i=e.data.data.menus;t.menuList=i,t.getMenuAchievements(1,"",1)}))},getMenuAchievements:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,i=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;this.achievementsLoading=!0,Object(u["h"])(e,i).then((function(e){var i,a=e.data.data.achievements||[],s=[];(a.forEach((function(t){s.push(t),t.SeriesAchievementList&&t.SeriesAchievementList.forEach((function(t,e){e>0&&s.push(t)}))})),t.achievements=s,t.achievements_bak=Object(m["cloneDeep"])(t.achievements),1!=n)?(t.queryFinish(),t.selectTabChange()):null!==(i=t.currentRole)&&void 0!==i&&i.jx3id&&t.addRoleConfirm(t.currentRole.jx3id,1)})).finally((function(){t.achievementsLoading=!1}))},addRole:function(){var t=this;this.kithForm={roleType:"1",userId:"",jx3Id:""},this.showAddRole=!0,this.$nextTick((function(){t.$refs.roleRef.clearValidate()}))},getMyKith:function(){var t=this;Object(h["b"])().then((function(e){t.myKith=e.data.data}))},loadUserRoles:function(){var t=this;v["a"].isLogin()?Object(f["a"])().then((function(e){var i,n,a,s;t.roleList=(null===(i=e.data)||void 0===i||null===(n=i.data)||void 0===n?void 0:n.list)||[],t.currentRole=(null===(a=e.data)||void 0===a||null===(s=a.data)||void 0===s?void 0:s.list[0])||{},t.getList(),t.getMyKith()})):this.$confirm("请先登录").then((function(t){v["a"].toLogin(window.location.href)}))},getKithRolesList:function(){var t=this;Object(h["c"])(this.kithForm.uid).then((function(e){t.myKithRoles=e.data.data,t.kithForm.jx3Id=""}))},delRole:function(t,e){this.contrastKith.splice(e,1),this.selectTab="";var i=[],n=Object(m["cloneDeep"])(this.selectOptions);n.forEach((function(e,n){e.value!==t.jx3id&&i.push(e)})),this.selectOptions=i,this.selectTabChange(!0)},setRoleInfo:function(t){if(1==this.kithForm.roleType){var e=this.roleList.find((function(e){return e.jx3id==t}));this.kithForm.info=e}else{var i=this.myKithRoles.find((function(e){return e.jx3id==t}));this.kithForm.info=i}},addRoleConfirm:function(t,e){var i=this,n=!1;this.contrastKith.forEach((function(a){a.jx3id==(1==e?t:i.kithForm.jx3Id)&&(n=!0)})),n?this.$message.warning("该角色已存在"):Object(u["m"])(1==e?t:this.kithForm.jx3Id).then((function(t){var n,a,s=((null===(n=t.data)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.achievements)||"").split(","),c={};c=e?Object(r["a"])(Object(r["a"])({},i.currentRole),{},{my_achievements:s,achievements:[]}):Object(r["a"])(Object(r["a"])({},i.kithForm.info),{},{my_achievements:s,achievements:[]}),i.selectOptions.push({value:c.jx3id,name:c.name+"未完成"}),1==e&&i.contrastKith[0]?i.$set(i.contrastKith,0,c):i.contrastKith.push(c),i.achievements=Object(m["cloneDeep"])(i.achievements_bak),i.queryFinish(),i.showAddRole=!1,i.selectTabChange()}))},queryFinish:function(t){var e=this,i=this.contrastKith,n=this.achievements;i.forEach((function(t,i){e.contrastKith[i].achievements=[],n.forEach((function(n,a){t.my_achievements.includes(n.ID.toString())?e.contrastKith[i].achievements.push({key:a,value:n.ID.toString()}):e.contrastKith[i].achievements.push({key:a,value:"-1"})}))})),t||(this.contrastKith_bak=Object(m["cloneDeep"])(this.contrastKith))},getIntersectionByKey:function(t,e){if(0===t.length)return[];var i=t.map((function(t){return t.map((function(t){return t[e]}))}));return"object"==Object(l["a"])(this.selectTab)&&this.selectTab instanceof Array&&1!=this.selectTab[0]?Object(o["a"])(new Set(i.flat())):i.reduce((function(t,e){return t.filter((function(t){return e.includes(t)}))}))},selectTabChange:function(){var t=this,e=this.selectTab,i="",n=Object(m["cloneDeep"])(this.achievements_bak),a=Object(m["cloneDeep"])(this.contrastKith_bak);if(0==e.length)return this.achievements=n,void this.queryFinish();1==e[e.length-1]&&(i=1,this.selectTab=[i]),e.length>1&&1==e[0]&&(i=e[e.length-1],this.selectTab=[i]),1==e.length&&1!=e[0]&&(i=e[0]),e.length>1&&(1!=e[0]||1!=e[e.length-1])&&(i=e);var s=[];a.forEach((function(t,e){var n=[],a=function(t){t.forEach((function(t,e){"-1"==t.value&&n.push({key:t.key,value:t.value})})),s.push(n)};(2==i&&0==e||1==i||t.jx3id==i||"object"==Object(l["a"])(i)&&i instanceof Array&&i.includes(t.jx3id))&&a(t.achievements),t.achievements=n}));var c=this.getIntersectionByKey(s,"key"),o=[];c.map((function(e){t.achievements_bak[e]&&o.push(t.achievements_bak[e])})),this.achievements=o,this.queryFinish(!0)}}},b=p,g=(i("f356"),i("2877")),k=Object(g["a"])(b,s,c,!1,null,"968f2c32",null),_=k.exports,y=(i("fb6a"),function(){var t=this,e=t._self._c;return e("div",{staticClass:"p-compare-mobile",class:{fold:t.isFold}},[e("div",{staticClass:"m-overview-header_mobile"},[e("div",{staticClass:"u-name"},[e("i",{class:t.isFold?"el-icon-s-unfold":"el-icon-s-fold ",on:{click:t.changeFold}}),t._v("  ")]),e("div",{staticClass:"u-select"},[e("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":"",clearable:""},on:{change:t.selectTabChange},model:{value:t.selectTab,callback:function(e){t.selectTab=e},expression:"selectTab"}},t._l(t.selectOptions,(function(t){return e("el-option",{key:t.value,attrs:{label:t.name,value:t.value}})})),1)],1)]),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.isFold,expression:"!isFold"}],staticClass:"m-achievement-tab"},t._l(t.menuList,(function(i,n){return e("ul",{key:n,staticClass:"u-zl-item",class:{active:i.sub==t.activeIndex,show:i.sub==t.activeIndex&&!t.activeShow},on:{click:function(e){return t.setActiveIndex(i.sub)}}},[e("div",{staticClass:"u-zl-item_title"},[t._v(" "+t._s(i.name)+" "),e("i",{class:i.sub==t.activeIndex&&t.activeShow?"el-icon-caret-top":"el-icon-caret-bottom",on:{click:function(e){return e.stopPropagation(),t.setActiveShow(i.sub)}}})]),t._l(i.children,(function(n,a){return e("li",{key:a,staticClass:"u-zl-item_children",class:{active:n.detail==t.activeIndexChildren},on:{click:function(e){return e.stopPropagation(),t.setActiveIndex(i.sub,n.detail)}}},[t._v(" "+t._s(n.name)+" ")])}))],2)})),0),e("div",{staticClass:"m-compare-main"},[e("div",{staticClass:"u-zl-box"},[e("div",{staticClass:"u-zl_table",style:"max-width:"+60*(t.contrastKith.length+1)+"120px"},[t._m(0),t._l(t.contrastKith,(function(i,n){return e("div",{key:n,staticClass:"u-table_label kith"},[e("el-dropdown",{attrs:{trigger:"click"}},[e("div",{staticClass:"u-name"},[t._v(t._s(i.name.slice(0,1)))]),e("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[e("el-dropdown-item",[e("div",{on:{click:function(e){return t.delRole(i,n)}}},[t._v("删除")])])],1)],1)],1)})),e("div",{staticClass:"u-table_label add",on:{click:t.addRole}},[e("i",{staticClass:"el-icon-circle-plus-outline u-add-icon"})])],2),e("div",{staticClass:"u-zl_cell",style:"max-width:"+60*(t.contrastKith.length+1)+"120px"},[e("div",{staticClass:"u-zl-list ps"},t._l(t.achievements,(function(i,n){return e("div",{key:n,staticClass:"u-zl-list_item"},[e("span",{staticClass:"u-name"},[t._v("["+t._s(null===i||void 0===i?void 0:i.Name)+"]")])])})),0),t._l(t.contrastKith,(function(i,n){return e("div",{key:n,staticClass:"u-zl-list"},t._l(i.achievements,(function(t,i){return e("div",{key:i,staticClass:"u-zl-list_item kith"},[e("div",{staticClass:"u-self-checked",class:{finish:"-1"!=t.value}},[e("i",{staticClass:"el-icon-check"})])])})),0)})),e("div",{staticClass:"u-zl-list add"},t._l(t.achievements,(function(t,i){return e("div",{key:i,staticClass:"u-zl-list_item kith"})})),0)],2)])]),e("el-dialog",{attrs:{title:"添加角色",visible:t.showAddRole,width:"400px",draggable:"","close-on-click-modal":!1},on:{"update:visible":function(e){t.showAddRole=e}}},[e("el-form",{ref:"roleRef",attrs:{model:t.kithForm,rules:t.rules}},[e("el-form-item",{attrs:{label:"角色类型",prop:"roleType"}},[e("el-radio-group",{on:{input:function(e){t.kithForm.userId="",t.kithForm.jx3Id=""}},model:{value:t.kithForm.roleType,callback:function(e){t.$set(t.kithForm,"roleType",e)},expression:"kithForm.roleType"}},[e("el-radio",{attrs:{label:"1"}},[t._v("自身")]),e("el-radio",{attrs:{label:"2"}},[t._v("亲友")])],1)],1),2==t.kithForm.roleType?e("el-form-item",{attrs:{label:"我的亲友",prop:"uid"}},[e("el-select",{attrs:{placeholder:"请选择"},on:{change:t.getKithRolesList},model:{value:t.kithForm.uid,callback:function(e){t.$set(t.kithForm,"uid",e)},expression:"kithForm.uid"}},t._l(t.myKith,(function(t,i){var n;return e("el-option",{key:i,attrs:{label:(null===t||void 0===t||null===(n=t.kith_info)||void 0===n?void 0:n.display_name)||"-",value:t.kith_id}})})),1)],1):t._e(),e("el-form-item",{attrs:{label:"对应角色",prop:"jx3Id"}},[e("el-select",{attrs:{placeholder:"请选择对应角色"},on:{change:t.setRoleInfo},model:{value:t.kithForm.jx3Id,callback:function(e){t.$set(t.kithForm,"jx3Id",e)},expression:"kithForm.jx3Id"}},t._l(1==t.kithForm.roleType?t.roleList:t.myKithRoles,(function(t,i){return e("el-option",{key:i,attrs:{label:t.name,value:t.jx3id}})})),1)],1)],1),e("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.showAddRole=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.addRoleConfirm}},[t._v("确 定")])],1)],1)],1)}),x=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"u-table_label ps"},[e("span",{staticClass:"u-compare-title"},[t._v("亲友对比")])])}],j={components:{},data:function(){return{isFold:!1,currentRole:{},menuList:[],selectTab:"",selectTabName:"请选择筛选条件",selectOptions:[{name:"共同未完成的",value:1}],activeIndex:1,activeShow:!0,activeIndexChildren:null,achievements:[],achievements_bak:[],showAddRole:!1,myKith:[],myKithRoles:[],roleList:[],kithForm:{uid:"",jx3Id:""},rules:{roleType:{required:!0,message:"请选择类型",trigger:"change"},uid:{required:!0,message:"请选择亲友",trigger:"change"},jx3Id:{required:!0,message:"请选择角色",trigger:"change"}},contrastKith:[],contrastKith_bak:[]}},created:function(){this.loadUserRoles()},mounted:function(){},methods:{changeFold:function(){this.isFold=!this.isFold,this.$store.commit("SET_STATE",{key:"is_fold",value:this.isFold})},icon_url:function(t){return Object(d["k"])(t)},setActiveShow:function(t){this.activeIndex!=t?this.setActiveIndex(t):this.activeShow=!this.activeShow},setActiveIndex:function(t,e){this.achievementsLoading||(this.activeIndex==t||e||(this.activeShow=!0),this.activeIndex=t,this.activeIndexChildren=e||null,this.getMenuAchievements(t,e))},getList:function(){var t=this;Object(u["i"])({general:1,client:this.$store.state.client}).then((function(e){var i=e.data.data.menus;t.menuList=i,t.getMenuAchievements(1,"",1)}))},getMenuAchievements:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,i=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;Object(u["h"])(e,i).then((function(e){var i,a=e.data.data.achievements||[],s=[];(a.forEach((function(t){s.push(t),t.SeriesAchievementList&&t.SeriesAchievementList.forEach((function(t,e){e>0&&s.push(t)}))})),t.achievements=s,t.achievements_bak=Object(m["cloneDeep"])(t.achievements),1!=n)?(t.queryFinish(),t.selectTabChange()):null!==(i=t.currentRole)&&void 0!==i&&i.jx3id&&t.addRoleConfirm(t.currentRole.jx3id,1)}))},addRole:function(){var t=this;this.kithForm={roleType:"1",userId:"",jx3Id:""},this.showAddRole=!0,this.$nextTick((function(){t.$refs.roleRef.clearValidate()}))},getMyKith:function(){var t=this;Object(h["b"])().then((function(e){t.myKith=e.data.data}))},loadUserRoles:function(){var t=this;v["a"].isLogin()?Object(f["a"])().then((function(e){var i,n,a,s;t.roleList=(null===(i=e.data)||void 0===i||null===(n=i.data)||void 0===n?void 0:n.list)||[],t.currentRole=(null===(a=e.data)||void 0===a||null===(s=a.data)||void 0===s?void 0:s.list[0])||{},t.getList(),t.getMyKith()})):this.$confirm("请先登录").then((function(t){v["a"].toLogin(window.location.href)}))},getKithRolesList:function(){var t=this;Object(h["c"])(this.kithForm.uid).then((function(e){t.myKithRoles=e.data.data,t.kithForm.jx3Id=""}))},delRole:function(t,e){this.contrastKith.splice(e,1),this.selectTab="";var i=[],n=Object(m["cloneDeep"])(this.selectOptions);n.forEach((function(e,n){e.value!==t.jx3id&&i.push(e)})),this.selectOptions=i,this.selectTabChange()},setRoleInfo:function(t){if(1==this.kithForm.roleType){var e=this.roleList.find((function(e){return e.jx3id==t}));this.kithForm.info=e}else{var i=this.myKithRoles.find((function(e){return e.jx3id==t}));this.kithForm.info=i}},addRoleConfirm:function(t,e){var i=this,n=!1;this.contrastKith.forEach((function(a){a.jx3id==(1==e?t:i.kithForm.jx3Id)&&(n=!0)})),n?this.$message.warning("该角色已存在"):Object(u["m"])(1==e?t:this.kithForm.jx3Id).then((function(t){var n,a,s=((null===(n=t.data)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.achievements)||"").split(","),c={};c=e?Object(r["a"])(Object(r["a"])({},i.currentRole),{},{my_achievements:s,achievements:[]}):Object(r["a"])(Object(r["a"])({},i.kithForm.info),{},{my_achievements:s,achievements:[]}),i.selectOptions.push({value:c.jx3id,name:c.name+"未完成"}),1==e&&i.contrastKith[0]?i.$set(i.contrastKith,0,c):i.contrastKith.push(c),i.achievements=Object(m["cloneDeep"])(i.achievements_bak),i.queryFinish(),i.showAddRole=!1,i.selectTabChange()}))},queryFinish:function(t){var e=this,i=this.contrastKith,n=this.achievements;i.forEach((function(t,i){e.contrastKith[i].achievements=[],n.forEach((function(n,a){t.my_achievements.includes(n.ID.toString())?e.contrastKith[i].achievements.push({key:a,value:n.ID.toString()}):e.contrastKith[i].achievements.push({key:a,value:"-1"})}))})),t||(this.contrastKith_bak=Object(m["cloneDeep"])(this.contrastKith))},getIntersectionByKey:function(t,e){if(0===t.length)return[];var i=t.map((function(t){return t.map((function(t){return t[e]}))}));return"object"==Object(l["a"])(this.selectTab)&&this.selectTab instanceof Array?Object(o["a"])(new Set(i.flat())):i.reduce((function(t,e){return t.filter((function(t){return e.includes(t)}))}))},selectTabChange:function(){var t=this,e=this.selectTab,i="",n=Object(m["cloneDeep"])(this.achievements_bak),a=Object(m["cloneDeep"])(this.contrastKith_bak);if(0==e.length)return this.achievements=n,void this.queryFinish();1==e[e.length-1]&&(i=1,this.selectTab=[i]),e.length>1&&1==e[0]&&(i=e[e.length-1],this.selectTab=[i]),1==e.length&&1!=e[0]&&(i=e[0]),e.length>1&&(1!=e[0]||1!=e[e.length-1])&&(i=e);var s=[];a.forEach((function(t,e){var n=[],a=function(t){t.forEach((function(t,e){"-1"==t.value&&n.push({key:t.key,value:t.value})})),s.push(n)};(2==i&&0==e||1==i||t.jx3id==i||"object"==Object(l["a"])(i)&&i instanceof Array&&i.includes(t.jx3id))&&a(t.achievements),t.achievements=n}));var c=this.getIntersectionByKey(s,"key"),o=[];c.map((function(e){t.achievements_bak[e]&&o.push(t.achievements_bak[e])})),this.achievements=o,this.queryFinish(!0)}}},C=j,w=(i("1152"),Object(g["a"])(C,y,x,!1,null,"be878848",null)),I=w.exports,F={components:{pc:_,mobile:I},data:function(){return{}},computed:{mobile:function(){var t=navigator.userAgent.toLowerCase(),e=["android","iphone","ipad","ipod","windows phone"];return e.some((function(e){return t.includes(e)}))}},created:function(){},mounted:function(){},methods:{}},O=F,R=(i("d46d"),Object(g["a"])(O,n,a,!1,null,"543fc175",null));e["default"]=R.exports},4069:function(t,e,i){"use strict";var n=i("44d2");n("flat")},"4c53":function(t,e,i){"use strict";var n=i("23e7"),a=i("857a"),s=i("af03");n({target:"String",proto:!0,forced:s("sub")},{sub:function(){return a(this,"sub","","")}})},9485:function(t,e,i){"use strict";var n=i("23e7"),a=i("2266"),s=i("59ed"),c=i("825a"),o=i("46c4"),l=TypeError;n({target:"Iterator",proto:!0,real:!0},{reduce:function(t){c(this),s(t);var e=o(this),i=arguments.length<2,n=i?void 0:arguments[1],r=0;if(a(e,(function(e){i?(i=!1,n=e):n=t(n,e,r),r++}),{IS_RECORD:!0}),i)throw new l("Reduce of empty iterator with no initial value");return n}})},"9b9f":function(t,e,i){},"9d4a":function(t,e,i){"use strict";i("9485")},a2bf:function(t,e,i){"use strict";var n=i("e8b5"),a=i("07fa"),s=i("3511"),c=i("0366"),o=function(t,e,i,l,r,u,h,d){var v,f,m=r,p=0,b=!!h&&c(h,d);while(p<l)p in i&&(v=b?b(i[p],p,e):i[p],u>0&&n(v)?(f=a(v),m=o(t,e,v,f,m,u-1)-1):(s(m+1),t[m]=v),m++),p++;return m};t.exports=o},c967:function(t,e,i){"use strict";i.d(e,"i",(function(){return a})),i.d(e,"e",(function(){return s})),i.d(e,"d",(function(){return c})),i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return l})),i.d(e,"g",(function(){return r})),i.d(e,"a",(function(){return u})),i.d(e,"f",(function(){return h})),i.d(e,"h",(function(){return d}));var n=i("41cb");function a(t){return Object(n["a"])().get("/api/cms/wiki/post/rank",{params:t})}function s(t,e){return Object(n["a"])().get("/api/cms/wiki/post/id/".concat(t),{params:e})}function c(t){return Object(n["a"])({mute:!0}).get("/api/cms/user/".concat(t,"/info"))}function o(t){return Object(n["a"])().get("/api/cms/user/kith/my")}function l(t){return Object(n["a"])().get("/api/cms/user/kith/game-roles/".concat(t))}function r(t){return Object(n["a"])().get("/api/cms/pvx/wiki_achievement_leap_schema",{params:t})}function u(t){return Object(n["a"])().post("/api/cms/pvx/wiki_achievement_leap_schema",t)}function h(t){return Object(n["a"])().get("/api/cms/pvx/wiki_achievement_leap_schema/".concat(t))}function d(t){return Object(n["a"])().post("/api/cms/pvx/wiki_achievement_difficulty/list",t)}},d46d:function(t,e,i){"use strict";i("2788")},d58f:function(t,e,i){"use strict";var n=i("59ed"),a=i("7b0b"),s=i("44ad"),c=i("07fa"),o=TypeError,l="Reduce of empty array with no initial value",r=function(t){return function(e,i,r,u){var h=a(e),d=s(h),v=c(h);if(n(i),0===v&&r<2)throw new o(l);var f=t?v-1:0,m=t?-1:1;if(r<2)while(1){if(f in d){u=d[f],f+=m;break}if(f+=m,t?f<0:v<=f)throw new o(l)}for(;t?f>=0:v>f;f+=m)f in d&&(u=i(u,d[f],f,h));return u}};t.exports={left:r(!1),right:r(!0)}},f356:function(t,e,i){"use strict";i("2608")}}]);
//# sourceMappingURL=chunk-d3e83308.116c2b2a.js.map