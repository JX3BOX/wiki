(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2eb25ea3"],{"498a":function(t,e,s){"use strict";var a=s("23e7"),i=s("58a8").trim,n=s("c8d2");a({target:"String",proto:!0,forced:n("trim")},{trim:function(){return i(this)}})},"79c7":function(t,e,s){"use strict";s.r(e);s("b680");var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-home-view"},[e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-location-information"}),e("span",[t._v("便捷入口")])]),e("template",{slot:"head-actions"},[e("a",{staticClass:"u-more",attrs:{target:"_blank",href:t.feedback}},[t._v("反馈建议 »")])]),e("template",{slot:"body"},[e("ul",{staticClass:"m-qlinks"},[e("li",{staticClass:"qlink"},[e("a",{staticStyle:{"background-color":"#fe7979"},attrs:{target:"_blank",href:"/tool/18151/"}},[e("i",{staticClass:"el-icon-trophy"}),e("span",[t._v("游戏内看百科")])])]),e("li",{staticClass:"qlink"},[e("router-link",{attrs:{to:{name:"waiting"}}},[e("i",{staticClass:"el-icon-edit-outline"}),e("span",[t._v("待攻略物品")]),e("span",{staticClass:"u-waiting",style:t.waitingColorStyle()},[t._v("（"+t._s(t.solveRate.toFixed(2))+"%）")])])],1),e("li",{staticClass:"qlink"},[e("router-link",{attrs:{to:{name:"search",query:{ids:"5_24423,5_24424,5_24425,5_24426,5_24427,5_24428,5_24429,5_24430"}}}},[e("i",{staticClass:"el-icon-cherry"}),e("span",[t._v("五行石合成")])])],1),e("li",{staticClass:"qlink"},[e("a",{attrs:{target:"_blank",href:"/pvg/manufacture"}},[e("i",{staticClass:"el-icon-magic-stick"}),e("span",[t._v("技艺助手")])])]),e("li",{staticClass:"qlink"},[e("a",{attrs:{target:"_blank",href:"/pvg/price"}},[e("i",{staticClass:"el-icon-orange"}),e("span",[t._v("金价走势")])])]),e("li",{staticClass:"qlink"},[e("a",{attrs:{target:"_blank",href:"/pvg/item_price"}},[e("i",{staticClass:"el-icon-orange"}),e("span",[t._v("物价大全")])])])])])],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-notebook-1"}),e("span",[t._v("最新物品")])]),e("template",{slot:"body"},[e("div",{staticClass:"m-plan-list"},[t.new_plans&&t.new_plans.length?e("el-carousel",{attrs:{height:"86px",direction:"vertical","indicator-position":"none"}},t._l(t.new_plans,(function(s,a){return e("el-carousel-item",{key:a,staticClass:"m-carousel m-carousel-hot"},[e("el-row",{attrs:{gutter:20}},[t._l(s,(function(s,a){return[s?e("el-col",{key:a,attrs:{md:8}},[e("router-link",{staticClass:"u-item",class:"u-item-".concat(a),attrs:{to:"/view/"+s.id}},[e("div",{staticClass:"u-icon"},[e("img",{attrs:{src:t.icon_url(s.IconID)}})]),e("div",{staticClass:"u-content"},[e("span",{staticClass:"u-name"},[e("span",{domProps:{textContent:t._s(s.Name)}})]),e("game-text",{staticClass:"u-desc",attrs:{text:s.Desc?s.Desc:"该物品没有描述",client:t.client}})],1)])],1):t._e()]}))],2)],1)})),1):e("div",{staticStyle:{"text-align":"center"}},[t._v("😂 暂无物品清单")])],1)])],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-notebook-1"}),e("span",[t._v("最热物品")])]),e("template",{slot:"body"},[e("div",{staticClass:"m-plan-list"},[t.hot_plans&&t.hot_plans.length?e("el-carousel",{attrs:{height:"86px",direction:"vertical","indicator-position":"none"}},t._l(t.hot_plans,(function(s,a){return e("el-carousel-item",{key:a,staticClass:"m-carousel m-carousel-hot"},[e("el-row",{attrs:{gutter:20}},[t._l(s,(function(s,a){return[s?e("el-col",{key:a,attrs:{md:8}},[e("router-link",{staticClass:"u-item",class:"u-item-".concat(a),attrs:{to:"/view/"+s.id}},[e("div",{staticClass:"u-icon"},[e("img",{attrs:{src:t.icon_url(s.IconID)}})]),e("div",{staticClass:"u-content"},[e("span",{staticClass:"u-name"},[e("span",{domProps:{textContent:t._s(s.Name)}})]),e("game-text",{staticClass:"u-desc",attrs:{text:s.Desc?s.Desc:"该物品没有描述",client:t.client}})],1)])],1):t._e()]}))],2)],1)})),1):e("div",{staticStyle:{"text-align":"center"}},[t._v("😂 暂无物品清单")])],1)])],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-collection"}),e("span",[t._v("最新攻略")])]),e("template",{slot:"body"},[t.newest_posts.length?e("div",{staticClass:"wiki-post-list"},t._l(t.newest_posts,(function(s,a){return e("div",{key:a,staticClass:"wiki-post"},[e("div",{staticClass:"m-about-post"},[e("div",{staticClass:"m-wiki"},[e("div",{staticClass:"u-wiki"},[e("img",{staticClass:"u-icon",attrs:{src:t.icon_url(s.source_icon_id)},on:{"~error":function(e){e.target.src=t.icon_url()}}}),e("router-link",{staticClass:"u-name",attrs:{to:{name:"view",params:{item_id:s.source_id}},target:"_blank"}},[e("span",{domProps:{textContent:t._s(s.title)}})])],1),e("div",{staticClass:"u-level",domProps:{textContent:t._s("综合难度："+t.star(s.level))}}),s.remark?e("div",{staticClass:"u-remark",domProps:{textContent:t._s("📑 "+s.remark)}}):t._e()]),e("div",{staticClass:"m-user"},[e("div",{staticClass:"u-author"},[e("img",{staticClass:"u-icon",attrs:{src:t.showAvatar(s.user_avatar),alt:s.user_nickname}}),s.user_id?e("a",{staticClass:"u-name",attrs:{href:t._f("author_url")(s.user_id),target:"_blank"},domProps:{textContent:t._s(s.user_nickname)}}):e("span",{staticClass:"u-name"},[t._v(t._s(s.user_nickname))])]),e("div",{staticClass:"u-updated",domProps:{textContent:t._s(t.date_format(s.updated))}})])]),e("div",{staticClass:"m-excerpt"},[e("router-link",{staticClass:"u-excerpt",attrs:{to:{name:"view",params:{item_id:s.source_id}}}},[e("span",{domProps:{innerHTML:t._s(t.ellipsis(s.excerpt))}})])],1)])})),0):e("div",{staticStyle:{"text-align":"center"}},[t._v("😂 暂无攻略")])])],2)],1)},i=[],n=(s("498a"),s("fb6a"),s("4de4"),s("d3b7"),s("d81d"),s("b0c0"),s("ac1f"),s("466d"),s("5319"),s("662c")),c=s("85e4"),l=s("b78a"),o=s("9616"),r=s("65c2"),u=s("8975"),_=s("c547"),d=s("2ef0"),p={name:"Home",data:function(){return{newest_posts:[],new_plans:[],hot_plans:[],feedback:r["feedback"],plan_2_icon:r["__iconPath"]+"icon/2410.png",plan_1_icon:r["__iconPath"]+"icon/3089.png",solveRate:0}},computed:{client:function(){return this.$store.state.client}},components:{WikiPanel:n["a"],GameText:_["a"]},methods:{icon_url:function(t){return Object(c["iconLink"])(t,this.client)},ellipsis:function(t){return t=t?t.trim():"",t.length>100?t.slice(0,100)+"...":t},date_format:u["date_format"],star:u["star"],showAvatar:function(t){return t&&Object(c["getThumbnail"])(t,20,!0)||Object(c["getThumbnail"])(r["default_avatar"],20,!0)},showItemTrending:function(t){if(t.sub_days_0_price&&t.sub_days_1_price)return t.sub_days_0_price-t.sub_days_1_price>0?"▲":t.sub_days_0_price-t.sub_days_1_price<0?"▼":""},showItemTrendingClass:function(t){if(t.sub_days_0_price&&t.sub_days_1_price)return t.sub_days_0_price-t.sub_days_1_price>0?"up":t.sub_days_0_price-t.sub_days_1_price<0?"down":"keep"},waitingColorStyle:function(){return this.solveRate>95?"color: #8dfa58":this.solveRate>60?"color: #e2d849":"color: #ff3838"}},created:function(){var t=this;Object(l["g"])().then((function(e){e=e.data,t.newest_posts=e.data.newest})),Object(l["p"])({client:this.client}).then((function(e){t.new_plans=Object(d["chunk"])(e.data,3)})),Object(o["b"])("item","views",15).then((function(e){var s=e.data.map((function(t){var e,s;return(null===t||void 0===t||null===(e=t.name)||void 0===e?void 0:e.match(/item-(\d+_\d+)/))&&(null===(s=t.name)||void 0===s?void 0:s.replace(/item-(\d+_\d+)/,"$1"))})).filter((function(t){return t}));Object(l["l"])({ids:s,client:t.client,per:15}).then((function(e){var s;t.hot_plans=Object(d["chunk"])(null===(s=e.data)||void 0===s?void 0:s.list,3)}))})).catch((function(t){console.log(t)})),Object(l["r"])({client:this.client}).then((function(e){var s,a=null!==(s=e.data.data)&&void 0!==s?s:{},i=a.wiki_count,n=a.source_count;t.solveRate=i/n*100}))}},m=p,v=(s("e799"),s("2877")),f=Object(v["a"])(m,a,i,!1,null,null,null);e["default"]=f.exports},c055:function(t,e,s){},c8d2:function(t,e,s){"use strict";var a=s("5e77").PROPER,i=s("d039"),n=s("5899"),c="​᠎";t.exports=function(t){return i((function(){return!!n[t]()||c[t]()!==c||a&&n[t].name!==t}))}},e799:function(t,e,s){"use strict";s("c055")}}]);
//# sourceMappingURL=chunk-2eb25ea3.5d07156b.js.map