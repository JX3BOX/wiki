# wiki

type 缺省时默认为 achievement

## 正式服
- 成就：https://page.j3cx.com/?type=achievement&id=5081
- 物品：https://page.j3cx.com/?type=item&id=5_24428  
- 书籍：https://page.j3cx.com/?type=item&id=5_8029_482  
- 宠物：https://page.j3cx.com/?type=pet&id=228
- 坐骑：https://page.j3cx.com/?type=horse&id=8_24920

## 怀旧服
- 成就：http://localhost:8080/?type=cj&id=493&L=classic_yq
- 物品：http://localhost:8080/?type=item&id=5_21&L=classic_yq
- 书籍：http://localhost:8080/?type=item&id=5_8029_482&L=classic_yq
- 宠物：http://localhost:8080/?type=pet&id=1&L=classic_yq
- 坐骑：http://localhost:8080/?type=horse&id=8_24920&L=classic_yq

## 云端宏

location / {
        add_header Cache-Control no-cache;
        expires 0;
        alias /www/wwwroot/jx3box/jx3box-v2/wiki/;
    }
    
    location /game {
        add_header Cache-Control no-cache;
        expires 0;
        alias /www/wwwroot/jx3box/jx3box-v2/wiki/;
    }
    location /macro/tops {
        add_header Cache-Control no-cache;
        expires 0;
        alias /www/wwwroot/jx3box/jx3box-v2/wiki/;
        index macros.html;
    }
    location /macro/details {
        add_header Cache-Control no-cache;
        expires 0;
        alias /www/wwwroot/jx3box/jx3box-v2/wiki/;
        index macro.html;
    }
    location /flowers {
        add_header Cache-Control no-cache;
        expires 0;
        alias /www/wwwroot/jx3box/jx3box-v2/wiki/;
        index flower.html;
    }
