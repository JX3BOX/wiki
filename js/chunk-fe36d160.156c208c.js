(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fe36d160"],{"38cf":function(t,e,s){"use strict";var a=s("23e7"),i=s("1148");a({target:"String",proto:!0},{repeat:i})},"3d2f":function(t,e,s){"use strict";s("38cf");e["a"]=function(t){return"⭐️".repeat(t||1)}},"500d":function(t,e,s){"use strict";s.d(e,"a",(function(){return c}));var a=s("41cb");const i=(t,e)=>Object(a["d"])().get("/pet/"+t,{params:e}),n=location.href.includes("origin")?"origin":"std",c={latest({type:t},e){return Object(a["a"])().get("/api/cms/wiki/post/latest",{params:{client:n,...e,type:t}})},counter({type:t},e){return Object(a["a"])().get("/api/cms/wiki/post/counter",{params:{client:n,...e,type:t}})},achievements(t){return Object(a["d"])().get("/achievement/list",{params:{client:n,...t}})},get({type:t,id:e},s){return Object(a["a"])().get(`/api/cms/wiki/post/type/${t}/source/${e}`,{params:{client:n,...s}})},getById(t){return Object(a["a"])().get("/api/cms/wiki/post/id/"+t)},versions({type:t,id:e},s){return Object(a["a"])().get(`/api/cms/wiki/post/type/${t}/source/${e}/versions`,{params:{client:n,...s}})},async handleMix(t,e,s,a){let i="",n="",c=!0,o=!1,r=[];if("std"===s){const l=await this.get({type:t,id:e},{client:s,...a});return i=l.data.data.post,n=l.data.data.source,r=l.data.data.users,i&&(c=!1),console.log("获取重制攻略"),{post:i,source:n,isEmpty:c,compatible:o,type:t,source_id:e,users:r}}{const l=await this.get({type:t,id:e},{client:s,...a});n=l.data.data.source,i=l.data.data.post,r=l.data.data.users,i&&(c=!1),console.log("获取缘起攻略");const u=!!l.data.data.post;return u?{post:i,source:n,isEmpty:c,compatible:o,type:t,source_id:e,users:r}:(console.log("兼容：获取重制攻略"),this.get({type:t,id:e},{client:"std",...a}).then(s=>(i=s.data.data.post,n||(n=s.data.data.source),i&&(c=!1),r=s.data.data.users,o=!0,{post:i,source:n,isEmpty:c,compatible:o,type:t,source_id:e,users:r})))}},async mix({type:t,id:e,client:s},a){let n="",c="";if(n="cj"===t?"achievement":"pet"===t?"item":t||"achievement",e){if(c=e,"pet"===t){const t=await i(e,{client:s});let c=t.data,o=c.ItemTabType+"_"+c.ItemTabIndex;return this.handleMix(n,o,s,a)}return this.handleMix(n,c,s,a)}}}},"61bf":function(t,e,s){},a15b:function(t,e,s){"use strict";var a=s("23e7"),i=s("e330"),n=s("44ad"),c=s("fc6a"),o=s("a640"),r=i([].join),l=n!==Object,u=l||!o("join",",");a({target:"Array",proto:!0,forced:u},{join:function(t){return r(c(this),void 0===t?",":t)}})},c9f1:function(t,e,s){"use strict";s("61bf")},cf45:function(t,e,s){"use strict";s.d(e,"a",(function(){return a}));s("ac1f"),s("5319"),s("498a"),s("fb6a");var a=function(t){return t=t?t.trim().replace(/<[^>]*>/g,""):"",t.length>100?t.slice(0,100)+"...":t}},f982:function(t,e,s){"use strict";s.r(e);s("b680");var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-home-view"},[e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-location-information"}),e("span",[t._v("便捷入口")])]),e("template",{slot:"head-actions"},[e("a",{staticClass:"other",attrs:{target:"_blank",href:t.feedback}},[t._v("反馈建议 »")])]),e("template",{slot:"body"},[e("ul",{staticClass:"u-qlinks"},[e("li",{staticClass:"u-qlink"},[e("a",{staticStyle:{"background-color":"#fe7979"},attrs:{target:"_blank",href:"/tool/9126/"}},[e("i",{staticClass:"el-icon-trophy"}),e("span",[t._v("游戏内看百科")])])]),e("li",{staticClass:"u-qlink"},[e("router-link",{attrs:{to:{name:"waiting"}}},[e("i",{staticClass:"el-icon-edit-outline"}),e("span",[t._v("待攻略成就")]),e("span",{staticClass:"u-waiting",style:t.waitingColorStyle()},[t._v("（"+t._s(t.solveRate.toFixed(2))+"%）")])])],1),e("li",{staticClass:"u-qlink"},[e("a",{attrs:{target:"_blank",href:t.hiddenAchievementsPostLink}},[e("i",{staticClass:"el-icon-medal"}),e("span",[t._v("隐藏成就")])])]),e("li",{staticClass:"u-qlink"},[e("a",{attrs:{target:"_blank",href:"/adventure"}},[e("i",{staticClass:"el-icon-ice-drink"}),e("span",[t._v("奇遇大全")])])]),e("li",{staticClass:"u-qlink"},[e("a",{attrs:{target:"_blank",href:"/pet"}},[e("i",{staticClass:"el-icon-lollipop"}),e("span",[t._v("宠物大全")])])])])])],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-notebook-1"}),e("span",[t._v("热门成就")])]),e("template",{slot:"body"},[e("div",{staticClass:"m-achievement-slider"},[e("el-carousel",{attrs:{height:"66px",direction:"vertical","indicator-position":"none"}},t._l(t.hot_achievements,(function(s,a){return e("el-carousel-item",{key:a,staticClass:"m-carousel m-hot"},[e("el-row",{attrs:{gutter:20}},[t._l(s,(function(s,a){return[s?e("el-col",{key:a,attrs:{md:8}},[e("router-link",{staticClass:"u-item",class:"u-item-".concat(a),attrs:{to:{name:"view",params:{source_id:s.ID}}}},[e("div",{staticClass:"u-icon"},[e("img",{attrs:{src:t.icon_url(s.IconID)},on:{"~error":function(e){return function(){e.target.src=t.icon_url()}.apply(null,arguments)}}})]),e("div",{staticClass:"m-carousel-content"},[e("span",{staticClass:"u-title"},[e("i",{staticClass:"el-icon-medal"}),e("span",{domProps:{textContent:t._s(" ".concat(s.Name))}})]),e("span",{staticClass:"u-desc"},[e("i",{staticClass:"el-icon-mic"}),e("span",{domProps:{innerHTML:t._s(" ".concat(s.Desc))}})]),t.views[s.ID]?e("span",{staticClass:"u-rank"},[e("i",{staticClass:"el-icon-watermelon"}),e("span",{domProps:{textContent:t._s("昨日 - ".concat(t.views[s.ID]["yesterday"]))}}),e("i",{staticClass:"el-icon-grape"}),e("span",{domProps:{textContent:t._s("七天 - ".concat(t.views[s.ID]["7days"]))}}),e("i",{staticClass:"el-icon-pear"}),e("span",{domProps:{textContent:t._s("三十天 - ".concat(t.views[s.ID]["30days"]))}})]):t._e()])])],1):t._e()]}))],2)],1)})),1)],1)])],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-notebook-2"}),e("span",[t._v("最新成就")])]),e("template",{slot:"head-actions"},[e("router-link",{staticClass:"other",attrs:{to:{name:"newest"}}},[t._v("查看更多 »")])],1),e("template",{slot:"body"},[e("el-carousel",{attrs:{height:"66px",direction:"vertical",interval:3500,"indicator-position":"none"}},t._l(t.newest_achievements,(function(s,a){return e("el-carousel-item",{key:a,staticClass:"m-carousel"},[e("el-row",{attrs:{gutter:20}},t._l(s,(function(s,a){return e("el-col",{key:a,attrs:{md:8}},[e("router-link",{staticClass:"u-item u-item-new",class:"u-item-".concat(a),attrs:{to:{name:"view",params:{source_id:s.ID}}}},[e("div",{staticClass:"u-icon"},[e("img",{attrs:{src:t.icon_url(s.IconID)}})]),e("div",{staticClass:"m-carousel-content"},[e("span",{staticClass:"u-title"},[e("i",{staticClass:"el-icon-medal"}),e("span",{domProps:{textContent:t._s(" ".concat(s.Name))}})]),e("span",{staticClass:"u-desc"},[e("i",{staticClass:"el-icon-mic"}),e("span",{domProps:{innerHTML:t._s(" ".concat(s.Desc))}})])])])],1)})),1)],1)})),1)],1)],2),e("WikiPanel",{attrs:{"border-none":!0}},[e("template",{slot:"head-title"},[e("i",{staticClass:"el-icon-collection"}),e("span",[t._v("最近攻略")])]),e("template",{slot:"body"},[e("el-row",{staticClass:"m-posts"},t._l(t.newest_posts,(function(s,a){return e("el-col",{key:a,staticClass:"m-post"},[e("div",{staticClass:"m-head"},[e("div",{staticClass:"m-achievement"},[e("div",{staticClass:"u-achievement"},[e("img",{staticClass:"u-icon",attrs:{src:t.icon_url(s.source_icon_id)},on:{"~error":function(e){e.target.src=t.icon_url("")}}}),e("router-link",{staticClass:"u-name",attrs:{to:{name:"view",params:{source_id:s.source_id}},target:"_blank"}},[t._v(t._s(s.title))])],1),e("div",{staticClass:"u-level",domProps:{textContent:t._s("综合难度："+t.star(s.level))}}),s.remark?e("div",{staticClass:"u-remark",domProps:{textContent:t._s("📑 "+s.remark)}}):t._e()]),e("div",{staticClass:"m-user"},[e("div",{staticClass:"u-author"},[e("img",{staticClass:"u-icon",attrs:{src:t.showAvatar(s.user),alt:s.user_nickname}}),e("a",{staticClass:"u-name",attrs:{href:s.user_id?t.author_url(s.user_id):null,target:"_blank"},domProps:{textContent:t._s(s.user_nickname)}})]),e("div",{staticClass:"u-updated",domProps:{textContent:t._s(t.ts2str(s.updated))}})])]),e("div",{staticClass:"m-body"},[e("div",{staticClass:"u-excerpt",attrs:{to:{name:"view",params:{source_id:s.source_id}}},domProps:{innerHTML:t._s(t.ellipsis(s.content))}})])])})),1)],1)],2)],1)},i=[],n=(s("14d9"),s("fb6a"),s("d3b7"),s("159b"),s("2ca0"),s("b0c0"),s("a15b"),s("07ac"),s("65c2")),c=s("9616"),o=s("500d"),r=s("85e4"),l=s("662c"),u=s("3d2f"),d=s("cf45"),p={name:"Home",data:function(){return{views:{},hot_achievements:null,newest_achievements:null,newest_posts:null,feedback:n["feedback"],solveRate:0}},computed:{isStd:function(){return"std"==this.$store.state.client},client:function(){return this.$store.state.client},hiddenAchievementsPostLink:function(){var t="std"==this.client?8104:43543;return Object(r["getLink"])("bbs",t)}},components:{WikiPanel:l["a"]},methods:{icon_url:function(t){return Object(r["iconLink"])(t,this.client)},author_url:r["authorLink"],ts2str:r["ts2str"],star:u["a"],ellipsis:d["a"],chuck:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,s=[],a=0;a<t.length;a+=e)s.push(t.slice(a,a+e));return s},waitingColorStyle:function(){return this.solveRate>95?"color: #8dfa58":this.solveRate>60?"color: #e2d849":"color: #ff3838"},showAvatar:function(t){var e=(null===t||void 0===t?void 0:t.user_avatar)||"";return Object(r["showAvatar"])(e)}},created:function(){var t=this,e="origin"==this.client?"origin_cj":"cj";Object(c["b"])(e,"views",12).then((function(e){e=e.data;var s=[];e.forEach((function(e){if(e.name.startsWith("cj")){var a=e.name.split("-").pop();s.push(a),t.views[a]=e.value}})),o["a"].achievements({ids:s.join(","),limit:s.length}).then((function(e){e=e.data,t.hot_achievements=t.chuck(Object.values(e.data.achievements))}))})),o["a"].achievements({per:12}).then((function(e){e=e.data,t.newest_achievements=t.chuck(Object.values(e.data.achievements))}),(function(){t.newest_achievements=[]})),o["a"].latest({type:"achievement"}).then((function(e){var s,a;t.newest_posts=null!==(s=null===(a=e.data.data)||void 0===a?void 0:a.list)&&void 0!==s?s:[]}),(function(){t.newest_posts=[]})),o["a"].counter({type:"achievement"}).then((function(e){var s,a=null!==(s=e.data.data)&&void 0!==s?s:{},i=a.wiki_count,n=a.source_count;t.solveRate=i/n*100}))}},m=p,v=(s("c9f1"),s("2877")),h=Object(v["a"])(m,a,i,!1,null,null,null);e["default"]=h.exports}}]);
//# sourceMappingURL=chunk-fe36d160.156c208c.js.map