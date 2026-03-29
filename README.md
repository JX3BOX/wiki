# Wiki

## 业务
+ cj 成就
+ item 物品
+ quest 任务
+ knowledge 通识
+ pc游戏插件
+ wujie无界内嵌

# wiki

type 缺省时默认为 achievement

## 正式服
- 成就：https://page.j3cx.com/?type=achievement&id=5081
- 物品：https://page.j3cx.com/?type=item&id=5_24428  
- 书籍：https://page.j3cx.com/?type=item&id=5_8029_482  
- 宠物：https://page.j3cx.com/?type=pet&id=228
- 坐骑：https://page.j3cx.com/?type=horse&id=8_24920
- 价格：https://page.j3cx.com/?type=price&id=5_31139&server=%E7%BB%9D%E4%BB%A3%E5%A4%A9%E9%AA%84

## 怀旧服
- 成就：https://page.j3cx.com/?type=cj&id=493&L=classic_yq
- 物品：https://page.j3cx.com/?type=item&id=5_21&L=classic_yq
- 书籍：https://page.j3cx.com/?type=item&id=5_8029_482&L=classic_yq
- 宠物：https://page.j3cx.com/?type=pet&id=1&L=classic_yq
- 坐骑：https://page.j3cx.com/?type=horse&id=8_24920&L=classic_yq
- 价格：https://page.j3cx.com/?type=price&id=5_24428&server=%E7%BC%98%E8%B5%B7%E7%A8%BB%E9%A6%99

## 云端宏
- 宏详情：https://page.j3cx.com/macro/details?l=zhcn&name=%E4%B8%B9%E6%9C%A8%23%E5%9B%9B%E6%AF%92%E7%8E%89%E7%9F%B3%E5%AE%8F&L=zhcn_hd
- 宏排行：https://page.j3cx.com/macro/tops?l=zhcn&L=zhcn_hd&kungfu=10021

## Rewrite
```
rewrite ^/jx3box/team https://www.jx3box.com/team;
rewrite ^/wiki/(\d+)?(.*) /?id=$1$2 permanent;
rewrite ^/quest/(\d+)?(.*) /?type=quest&id=$1$2 permanent;
rewrite ^/pet/(\d+)?(.*) /?type=pet&id=$1$2 permanent;
rewrite ^/item/(\d+)/(\d+)/price?(.*) /?type=price&id=$1_$2$3 permanent;
rewrite ^/item/(\d+)/(\d+)/(\d+)/price?(.*) /?type=price&id=$1_$2_$3$4 permanent;
rewrite ^/item/(\d+)/(\d+)?(.*) /?type=item&id=$1_$2$3 permanent;
rewrite ^/item/(\d+)/(\d+)/(\d+)?(.*) /?type=item&id=$1_$2_$3$4 permanent;
rewrite ^/ride/(\d+)/(\d+)?(.*) /?type=horse&id=$1_$2$3 permanent;
rewrite ^/game/(.*)?(.*) /?$1$2 permanent;
```
