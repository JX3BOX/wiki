(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-89f0793a"],{"0b00":function(t,e,i){},1441:function(t,e,i){"use strict";i("d2ca")},"18ba":function(t,e,i){"use strict";i("0b00")},"1c47":function(t,e,i){"use strict";var n=function(){var t=this,e=t._self._c;return t.hasContent?e("div",{staticClass:"m-achievement-single",class:{fold:t.fold,hidden:t.isHidden}},[t.initFold&&t.isLogin&&t.isVirtual?e("el-checkbox",{staticClass:"u-achievement-checkbox",model:{value:t.achievement.checked,callback:function(e){t.$set(t.achievement,"checked",e)},expression:"achievement.checked"}}):t._e(),e("div",{staticClass:"u-header"},[e("a",{staticClass:"u-title",attrs:{target:t.targetable},on:{click:function(e){return t.url_filter(t.achievement.ID)}}},[t.isLogin?[t.isVirtual?e("i",{staticClass:"m-achievement-status u-attr u-fav u-complete-status el-tag--light el-tag",class:t.completedVirtual?"el-tag--success":"el-tag--warning"},[e("i",{class:t.completedVirtual?"el-icon-check":"el-icon-warning-outline"}),t._v(" "+t._s(t.completedVirtual?"已完成":"待完成")+" ")]):e("i",{staticClass:"m-achievement-status u-attr u-fav u-complete-status el-tag--light el-tag",class:t.completed?"el-tag--success":"el-tag--warning"},[e("i",{class:t.completed?"el-icon-check":"el-icon-warning-outline"}),t._v(" "+t._s(t.completedText)+" ")])]:t._e(),e("span",{staticClass:"u-title-text"},[t._v(t._s(t.achievement.Name))])],2),e("div",{staticClass:"u-other"},[e("span",{staticClass:"u-attr",domProps:{textContent:t._s(t.achievement.post?"修订时间："+t.ts2str(t.achievement.post.updated):"")}}),e("span",{staticClass:"u-attr",domProps:{textContent:t._s(t.achievement.post?"综合难度："+t.star(t.achievement.post.level):"")}}),t.isLogin&&t.isVirtual?[t.completedVirtual?e("el-button",{staticClass:"u-attr u-fav",attrs:{type:"info",size:"mini",icon:"el-icon-close"},on:{click:function(e){return e.stopPropagation(),t.cancelVirtual()}}},[t._v(" 取消完成 ")]):e("el-button",{staticClass:"u-attr u-fav",attrs:{plain:"",size:"mini",icon:"el-icon-check"},on:{click:function(e){return e.stopPropagation(),t.finishVirtual()}}},[t._v(" 设为完成 ")])]:t._e(),t.showFavorite?e("Fav",{staticClass:"u-attr u-fav",attrs:{"post-type":"achievement","post-title":t.favTitle,"post-id":t.achievement.ID}}):t._e()],2)]),e("div",{staticClass:"u-body"},[e("div",{staticClass:"u-left",on:{click:function(e){return t.url_filter(t.achievement.ID)}}},[e("div",{staticClass:"u-attr u-icon"},[e("img",{attrs:{src:t.icon_url(t.achievement.IconID)},on:{"~error":function(e){return function(){e.target.src=t.icon_url()}.apply(null,arguments)}}})]),e("div",{staticClass:"u-attr u-desc",domProps:{innerHTML:t._s(t.achievement.Desc)}})]),e("div",{staticClass:"u-right"},[e("item-simple",{staticClass:"u-attr u-item-simple",attrs:{item:t.achievement.Item,"only-icon":"true","icon-size":"36px"}}),e("div",{staticClass:"u-attr u-point",domProps:{textContent:t._s(t.achievement.Point?t.achievement.Point:0)}})],1)]),e("div",{staticClass:"u-footer"},[t.achievement.Prefix||t.achievement.Postfix?e("div",{staticClass:"u-ch"},[t.achievement.PrefixName?e("div",{domProps:{textContent:t._s("称号前缀："+t.achievement.PrefixName)}}):t._e(),t.achievement.PostfixName?e("div",{domProps:{textContent:t._s("称号后缀："+t.achievement.PostfixName)}}):t._e()]):t._e(),t.achievement.SubAchievementList?e("el-row",{staticClass:"u-subs",attrs:{gutter:30}},t._l(t.achievement.SubAchievementList,(function(i,n){return e("el-col",{key:n,staticClass:"u-sub",attrs:{xs:12,sm:8,md:8}},[e("router-link",{attrs:{to:1==i.Visible?{name:"view",params:{source_id:i.ID}}:{},target:"_blank"}},[e("img",{staticClass:"u-icon",attrs:{src:t.icon_url(i.IconID)}}),e("span",{domProps:{textContent:t._s(i.Name)}})])],1)})),1):t._e(),t.achievement.SeriesAchievementList?e("div",{staticClass:"u-seriess"},t._l(t.achievement.SeriesAchievementList,(function(i,n){return e("div",{key:n,staticClass:"u-series",class:i.ID==t.achievement.ID?"active":""},[e("router-link",{attrs:{to:{name:"view",params:{source_id:i.ID}}}},[e("div",{staticClass:"u-status"},[t.hadCompleted(i.ID)?e("span",{staticClass:"u-check"},[t._v("已完成")]):e("span",{staticClass:"u-close"},[t._v("待完成")])]),e("img",{staticClass:"u-icon",attrs:{src:t.icon_url(i.IconID)}}),e("div",{staticClass:"detail"},[e("h4",{domProps:{textContent:t._s(i.Name)}}),e("p",{domProps:{innerHTML:t._s(t.description_filter(i.ShortDesc))}})])]),t.isLogin&&t.isVirtual?e("div",{staticClass:"u-op"},[t.hadCompleted(i.ID)?e("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"取消完成",placement:"bottom"}},[e("i",{staticClass:"u-icon el-icon-close",on:{click:function(e){return e.stopPropagation(),t.cancelVirtual(i.ID)}}})]):e("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"设为完成",placement:"bottom"}},[e("i",{staticClass:"u-icon el-icon-check",attrs:{title:"设为完成"},on:{click:function(e){return e.stopPropagation(),t.finishVirtual(i.ID)}}})])],1):t._e()],1)})),0):t._e()],1),t.empty?t._e():e("div",{staticClass:"u-expand",class:{disable:t.empty},on:{click:function(e){t.fold=!t.fold}}},[e("hr"),e("i",{staticClass:"u-icon el-icon-caret-top"}),e("i",{staticClass:"u-icon el-icon-caret-bottom"})])],1):t._e()},s=[],a=(i("99af"),i("4de4"),i("caad"),i("a15b"),i("14d9"),i("b0c0"),i("b64b"),i("d3b7"),i("ac1f"),i("2532"),i("5319"),i("498a"),i("159b"),i("85e4")),c=i("7a5f"),r=i("3d2f"),o=i("262e"),l=i("c9d2"),u={name:"AchievementSingle",components:{"item-simple":c["a"]},props:["achievement","initFold","target","jump","showFavorite"],data:function(){return{fold:!0}},computed:{routeName:function(){return this.$route.name},empty:function(){return!(this.achievement.Prefix||this.achievement.Postfix||this.achievement.SubAchievementList||this.achievement.SeriesAchievementList)},targetable:function(){return this.target||"undefined"!==typeof this.target?this.target:""},client:function(){return this.$store.state.client},hasContent:function(){return this.achievement&&Object.keys(this.achievement).length},currentRole:function(){return this.$store.state.role},completeAchievements:function(){return this.$store.state.achievements},completed:function(){var t=this;if("view"!==this.routeName&&this.achievement.Series){var e=this.achievement.Series.split("|");return e.every((function(e){return t.completeAchievements.includes(e)}))}return this.completeAchievements.includes(this.achievement.ID+"")},completedText:function(){var t=this;if("view"!==this.routeName&&this.achievement.Series){var e=0,i=this.achievement.Series.split("|");i.forEach((function(i){t.completeAchievements.includes(i)&&e++}));var n=i.length;return this.completed?"已完成":"待完成(".concat(e,"/").concat(n,")")}return this.completed?"已完成":"待完成"},isLogin:function(){return l["a"].isLogin()},favTitle:function(){var t;return null===(t=this.achievement)||void 0===t?void 0:t.Name},isVirtual:function(){var t;return!(null!==(t=this.currentRole)&&void 0!==t&&t.jx3id)},onlyUncompleted:function(){return this.$store.state.onlyUncompleted},isHidden:function(){var t=this.isVirtual?this.completedVirtual:this.completed;return this.onlyUncompleted&&t&&"view"!==this.routeName},achievementsVirtual:function(){return this.$store.state.achievementsVirtual},completedVirtual:function(){var t=this;if(this.achievement.Series){var e=this.achievement.Series.split("|");return e.every((function(e){return t.achievementsVirtual.includes(e)}))}return this.achievementsVirtual.includes(this.achievement.ID+"")}},watch:{initFold:{immediate:!0,handler:function(t){this.fold=t}}},methods:{hadCompleted:function(t){var e=this.isVirtual?this.achievementsVirtual:this.completeAchievements;return e.includes(t+"")},ts2str:a["ts2str"],star:r["a"],icon_url:function(t){return Object(a["iconLink"])(t,this.client)},url_filter:function(t){!0!==this.jump&&"undefined"!==typeof this.jump||(this.$store.state.scroll_tops[this.$route.name]=document.documentElement.scrollTop,this.$router.push({name:"view",params:{source_id:t}}))},description_filter:function(t){var e=/text="(.*?)(\\\\\\n)?"/.exec(t);return e&&e.length>1&&(t=e[1].trim()),t&&(t=t.replace(/\\n/g,"<br>")),t},finishVirtual:function(t){var e=this;if(this.isLogin||l["a"].toLogin(),console.log(this.currentRole),this.currentRole&&0===this.currentRole.jx3id){var i=(t||this.achievement.ID)+"";this.achievement.Series&&(i=t?t+"":this.achievement.Series.split("|").join());var n={achievements:i};Object(o["p"])(n).then((function(n){e.$notify({title:"操作成功",message:"已将该成就标记为已完成",type:"success"});var s=e.achievementsVirtual;if(!t&&e.achievement.Series){var a=e.achievement.Series.split("|");s=s.concat(a)}else s.includes(i)||s.push(i);e.$store.commit("SET_STATE",{key:"achievementsVirtual",value:s})}))}else this.$alert("请先在侧边栏选择虚拟角色","警告",{confirmButtonText:"确定"})},cancelVirtual:function(t){var e=this;if(this.isLogin||l["a"].toLogin(),this.currentRole&&!this.currentRole.jx3id){var i=(t||this.achievement.ID)+"";this.achievement.Series&&(i=t?t+"":this.achievement.Series.split("|").join());var n={achievements:i};Object(o["a"])(n).then((function(n){e.$notify({title:"操作成功",message:"已将该成就标记为待完成",type:"success"});var s=e.achievementsVirtual,a=[];a=!t&&e.achievement.Series?e.achievement.Series.split("|"):[i],s=s.filter((function(t){return!a.includes(t)})),e.$store.commit("SET_STATE",{key:"achievementsVirtual",value:s})}))}else this.$alert("请先在侧边栏选择虚拟角色","警告",{confirmButtonText:"确定"})}}},m=u,h=(i("18ba"),i("2877")),v=Object(h["a"])(m,n,s,!1,null,null,null);e["a"]=v.exports},"38cf":function(t,e,i){"use strict";var n=i("23e7"),s=i("1148");n({target:"String",proto:!0},{repeat:s})},"3d2f":function(t,e,i){"use strict";i("38cf");e["a"]=function(t){return"⭐️".repeat(t||1)}},7479:function(t,e,i){},"7a5f":function(t,e,i){"use strict";var n=function(){var t=this,e=t._self._c;return t.item?e("el-popover",{attrs:{placement:"right-end","popper-class":"m-simple-item-popup",width:"auto","visible-arrow":!1,trigger:"hover",transition:"none","close-delay":0},on:{show:function(e){t.item_id=t.item.id}},model:{value:t.visible,callback:function(e){t.visible=e},expression:"visible"}},[e("div",{staticClass:"m-simple-item",class:{onlyIcon:t.onlyIcon,withName:t.withName},attrs:{slot:"reference"},on:{mousedown:function(e){t.visible=!1}},slot:"reference"},[e("div",{staticClass:"m-icon"},[e("div",{staticClass:"u-border",style:{backgroundImage:t.item_border(t.item),opacity:5==t.item.Quality?.9:1}}),e("div",{staticClass:"u-border-quest",style:{backgroundImage:t.item_border_quest(t.item)}}),e("img",{staticClass:"u-icon",style:{width:t.iconSize,height:t.iconSize},attrs:{src:t.icon_url(t.item.IconID),alt:"IconID:".concat(t.item.IconID)}})]),e("span",{staticClass:"u-name",style:{color:t.item_color(t.item.Quality)},domProps:{textContent:t._s(t.item.Name)}}),e("span",{staticClass:"u-uiid fr",domProps:{textContent:t._s("ID: ".concat(t.item.id))}})]),e("jx3-item",{attrs:{item_id:t.item_id,"jx3-client-type":t.jx3ClientType}})],1):t._e()},s=[],a=i("c7fa");const{__imgPath:c,__iconPath:r}=i("dbaa");var o=t=>isNaN(parseInt(t))?c+"image/common/nullicon.png":`${r}icon/${t}.png`,l=i("1d18");const{__imgPath:u}=i("dbaa");var m=t=>{switch(t.Quality){case 3:return`url(${u}image/item/blue.png)`;case 4:return`url(${u}image/item/purple.png)`;case 5:return`url(${u}image/item/orange.gif)`;default:return""}};const{__imgPath:h}=i("dbaa");var v=t=>t.IsQuest>0?`url(${h}image/item/renwu.png)`:"",d={name:"ItemSimple",props:["item","onlyIcon","iconSize","withName","jx3ClientType"],data:function(){return{visible:!1,item_id:null}},methods:{icon_url:o,item_color:l["a"],item_border:m,item_border_quest:v},components:{"jx3-item":a["a"]}},p=d,f=(i("1441"),i("fe5d"),i("2877")),g=Object(f["a"])(p,n,s,!1,null,null,null);e["a"]=g.exports},b85c:function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));i("a4d3"),i("e01a"),i("d28b"),i("d9e2"),i("d3b7"),i("3ca3"),i("ddb0");var n=i("06c5");function s(t,e){var i="undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!i){if(Array.isArray(t)||(i=Object(n["a"])(t))||e&&t&&"number"===typeof t.length){i&&(t=i);var s=0,a=function(){};return{s:a,n:function(){return s>=t.length?{done:!0}:{done:!1,value:t[s++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,r=!0,o=!1;return{s:function(){i=i.call(t)},n:function(){var t=i.next();return r=t.done,t},e:function(t){o=!0,c=t},f:function(){try{r||null==i["return"]||i["return"]()}finally{if(o)throw c}}}}},d2ca:function(t,e,i){},fe5d:function(t,e,i){"use strict";i("7479")}}]);
//# sourceMappingURL=chunk-89f0793a.f6b0c2a6.js.map