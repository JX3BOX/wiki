(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ac33fb68"],{"04d1":function(e,t,n){"use strict";var i=n("342f"),c=i.match(/firefox\/(\d+)/i);e.exports=!!c&&+c[1]},"4e82":function(e,t,n){"use strict";var i=n("23e7"),c=n("e330"),s=n("59ed"),a=n("7b0b"),r=n("07fa"),o=n("083a"),u=n("577e"),l=n("d039"),h=n("addb"),m=n("a640"),f=n("04d1"),v=n("d998"),d=n("2d00"),p=n("512ce"),b=[],A=c(b.sort),g=c(b.push),j=l((function(){b.sort(void 0)})),k=l((function(){b.sort(null)})),_=m("sort"),w=!l((function(){if(d)return d<70;if(!(f&&f>3)){if(v)return!0;if(p)return p<603;var e,t,n,i,c="";for(e=65;e<76;e++){switch(t=String.fromCharCode(e),e){case 66:case 69:case 70:case 72:n=3;break;case 68:case 71:n=4;break;default:n=2}for(i=0;i<47;i++)b.push({k:t+i,v:n})}for(b.sort((function(e,t){return t.v-e.v})),i=0;i<b.length;i++)t=b[i].k.charAt(0),c.charAt(c.length-1)!==t&&(c+=t);return"DGBEFHACIJK"!==c}})),O=j||!k||!_||!w,$=function(e){return function(t,n){return void 0===n?-1:void 0===t?1:void 0!==e?+e(t,n)||0:u(t)>u(n)?1:-1}};i({target:"Array",proto:!0,forced:O},{sort:function(e){void 0!==e&&s(e);var t=a(this);if(w)return void 0===e?A(t):A(t,e);var n,i,c=[],u=r(t);for(i=0;i<u;i++)i in t&&g(c,t[i]);h(c,$(e)),n=r(c),i=0;while(i<n)t[i]=c[i++];while(i<u)o(t,i++);return t}})},"512ce":function(e,t,n){"use strict";var i=n("342f"),c=i.match(/AppleWebKit\/(\d+)\./);e.exports=!!c&&+c[1]},"891e":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e._self._c;return t("div",{staticClass:"m-normal-view"},[e.isLogin&&e.isVirtual?t("div",{staticClass:"m-normal-op"},[t("el-checkbox",{attrs:{border:"",size:"small"},on:{change:e.switchAll},model:{value:e.isAll,callback:function(t){e.isAll=t},expression:"isAll"}},[e._v("全选")]),e.selectedAchievements.length?[t("el-button",{attrs:{plain:"",icon:"el-icon-check",size:"small"},on:{click:function(t){return t.stopPropagation(),e.finishVirtual.apply(null,arguments)}}},[e._v(" 批量设为完成("+e._s(e.selectedAchievements.length)+") ")]),t("el-button",{attrs:{type:"info",icon:"el-icon-close",size:"small"},on:{click:function(t){return t.stopPropagation(),e.cancelVirtual.apply(null,arguments)}}},[e._v(" 批量取消完成("+e._s(e.selectedAchievements.length)+") ")])]:e._e()],2):e._e(),t("Achievements",{attrs:{achievements:e.achievements}})],1)},c=[],s=n("5530"),a=(n("99af"),n("4de4"),n("a630"),n("caad"),n("a15b"),n("d81d"),n("4e82"),n("d3b7"),n("6062"),n("2532"),n("3ca3"),n("4c53"),n("88e6"),n("70cc"),n("eb03"),n("22e5"),n("c01e"),n("fa76"),n("8306"),n("ddb0"),n("ba02")),r=n("262e"),o=n("2ef0"),u=n("c9d2"),l={name:"Normal",components:{Achievements:a["a"]},data:function(){return{achievements:[],isAll:!1}},computed:{isLogin:function(){return u["a"].isLogin()},currentRole:function(){return this.$store.state.role},selectedAchievements:function(){return Object(o["flattenDeep"])(this.achievements.filter((function(e){return e.checked})).map((function(e){return e.SeriesAchievementList?e.SeriesAchievementList:e})))},isVirtual:function(){var e;return!(null!==(e=this.currentRole)&&void 0!==e&&e.jx3id)},achievementsVirtual:function(){return this.$store.state.achievementsVirtual}},watch:{$route:{immediate:!0,handler:function(){this.isAll=!1,this.get_achievements(this.$route.params.sub,this.$route.params.detail)}}},methods:{switchAll:function(e){this.achievements=this.achievements.map((function(t){return Object(s["a"])(Object(s["a"])({},t),{},{checked:e})}))},get_achievements:function(e,t){var n=this;if(!e)return[];Object(r["e"])(e,t).then((function(e){e=e.data;var t=e.data.achievements&&e.data.achievements.length&&e.data.achievements.sort((function(e,t){var n=Object(o["get"])(e.post,"level",1),i=Object(o["get"])(t.post,"level",1);return n-i}));n.achievements=t.map((function(e){return Object(s["a"])(Object(s["a"])({},e),{},{checked:!1})}))}),(function(){n.achievements=[]}))},finishVirtual:function(){var e=this,t=this.selectedAchievements.map((function(e){return e.ID+""})),n={achievements:t.join()};Object(r["p"])(n).then((function(n){e.$notify({title:"操作成功",message:"已将选中成就标记为已完成",type:"success"});var i=Array.from(new Set(e.achievementsVirtual.concat(t)));e.$store.commit("SET_STATE",{key:"achievementsVirtual",value:i}),e.isAll=!1,e.achievements=e.achievements.map((function(e){return Object(s["a"])(Object(s["a"])({},e),{},{checked:!1})}))}))},cancelVirtual:function(){var e=this,t=this.selectedAchievements.map((function(e){return e.ID+""})),n={achievements:t.join()};Object(r["a"])(n).then((function(n){e.$notify({title:"操作成功",message:"已将选中成就标记为待完成",type:"success"});var i=e.achievementsVirtual.filter((function(e){return!t.includes(e)}));e.$store.commit("SET_STATE",{key:"achievementsVirtual",value:i}),e.isAll=!1,e.achievements=e.achievements.map((function(e){return Object(s["a"])(Object(s["a"])({},e),{},{checked:!1})}))}))}}},h=l,m=(n("b337"),n("2877")),f=Object(m["a"])(h,i,c,!1,null,null,null);t["default"]=f.exports},b337:function(e,t,n){"use strict";n("da7c")},ba02:function(e,t,n){"use strict";var i=function(){var e=this,t=e._self._c;return t("ul",{staticClass:"m-achievement-singles"},e._l(e.achievements,(function(n,i){return t("AchievementSingle",{key:i,attrs:{achievement:n,target:e.target,jump:e.jump,initFold:!0}})})),1)},c=[],s=(n("b0c0"),n("1c47")),a={name:"Achievements",props:["achievements","target","jump"],components:{AchievementSingle:s["a"]},watch:{achievements:function(){var e=this;this.$route&&"undefined"!==typeof this.$store.state.scroll_tops[this.$route.name]&&setTimeout((function(){window.scrollTo(0,e.$store.state.scroll_tops[e.$route.name])}),200)}}},r=a,o=n("2877"),u=Object(o["a"])(r,i,c,!1,null,null,null);t["a"]=u.exports},d998:function(e,t,n){"use strict";var i=n("342f");e.exports=/MSIE|Trident/.test(i)},da7c:function(e,t,n){}}]);
//# sourceMappingURL=chunk-ac33fb68.06c6d2dc.js.map