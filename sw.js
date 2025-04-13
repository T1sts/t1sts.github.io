/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/2022/02/21/Java学习-IO流/index.html","87f55c15faeea7f2ad072ed05e798972"],["/2022/10/18/Burp爆破识别验证码/index.html","2ff1a5c99c61dc206fe8afe58196df69"],["/2022/11/16/Oracle报错解决-ORA-12537/index.html","089cd7ddba1f05046db289a1b5842cc9"],["/2023/01/03/SID-RID/index.html","053402750e7c4429ab03da82fe7f0889"],["/2023/01/05/微信聊天取证/index.html","4b9a47fc6d2480c1bd0b5d01360b263a"],["/2023/03/07/Machine-user-Domain-user/index.html","3af0b641a0be439c85852d32751e1e67"],["/2023/03/26/Normal-domain-user-add-machine/index.html","4b504fd13ff1711c47f78595359d0801"],["/2023/03/26/active-directory/index.html","62420cc28e5ace8fab02c288953e91c7"],["/2023/03/27/Domain-user-group/index.html","7609f145f23e626351121a7aa3d2f7ea"],["/2023/03/28/Organizational-unit/index.html","98765172f4314e4902f6796212d7ec81"],["/2023/04/01/DCSync/index.html","f5ae340a7624bd0aabcb9a79ddf625cc"],["/2023/06/30/Shadow-Credentials/index.html","aede86e4496df142e9e3028da7d9437d"],["/2023/11/28/PHP-Code-Audit-SQL-Injection/index.html","7cf8cba0cc762ceb8ddb36b2fbc6faab"],["/2024/05/07/Redis服务排查/index.html","2758a7cb3df13b2cbe3526b7903f0276"],["/2024/05/08/Mysql服务排查/index.html","bd56350d57e871e574728681e332f066"],["/2024/05/31/Linux-backdoor/index.html","75a41337621e4630baf54f4a898b9dcb"],["/2025/04/08/AES-RSA动态密钥通信的流量分析与解密还原/index.html","4e0a5a62d879e31edcb0b4f3641ebdfb"],["/2025/04/08/禅道（Zentao）历史漏洞汇总/index.html","1a0a493e07fa44d93b6ab4733c10ca29"],["/404.html","603b5d618c60d0f0d16e491ee8fb62b2"],["/about/index.html","df85f1948bcba60dd156da60057fdddb"],["/archives/2022/02/index.html","e59f43fd7580bbf0bba616e97fcfd70b"],["/archives/2022/10/index.html","0ce85db6ccf8dd58af242ebdb7be8642"],["/archives/2022/11/index.html","b7e2bcd00668a8a91ede3f60fa9b6c60"],["/archives/2022/index.html","51083be551fda8606568596c11d6672f"],["/archives/2023/01/index.html","7eb57da6b15f8c667a280ea6406a6530"],["/archives/2023/03/index.html","dd8aa12c23726ceaf2def2a3faa66003"],["/archives/2023/04/index.html","b9b567e2cccfd01f491c48c460292fb1"],["/archives/2023/06/index.html","8d48fe4afe2dfd2629376b0748c5232b"],["/archives/2023/11/index.html","863e32fa8df43b808f33b4e6b746f70c"],["/archives/2023/index.html","8b7341f64430d886166d026d6d41e111"],["/archives/2024/05/index.html","71dec2eb7334df698b2a5571a9dbb974"],["/archives/2024/index.html","ecd80d10fdf2797e3d51e5eabb274e94"],["/archives/2025/04/index.html","68c161e2c7b0a7d8c0ebd3ca65a761b5"],["/archives/2025/index.html","9e981ad0797b23ed9b0761aa7844a0a3"],["/archives/index.html","1ad7f21f4781cd9bd5ef27479865fbe8"],["/archives/page/2/index.html","0586adc71643523a89163b342734b9bc"],["/categories/Active-directory-pentesting/index.html","a422baca875dad2d63a1d4d4792022d0"],["/categories/Code-Audit/index.html","5e015c4acf0586055229cd738a5b918e"],["/categories/Emergency-response/index.html","034503024830133164ce8a090d73d7c2"],["/categories/Encryption-and-decryption/index.html","7bfed5d408a270f4c6808eecaecd81bc"],["/categories/index.html","2d650c61c453a17a301595ee5c3cc070"],["/categories/permission-maintenance/index.html","1d5e1d391a1b11018e3da1e7f607f389"],["/categories/代码学习/index.html","f73394fea3b99307e26c6c79cf10dc35"],["/categories/实用技巧/index.html","d2aa0f34a17c0ff509947ec5248f8793"],["/categories/漏洞利用/index.html","1e1f28d2dc4b6a30c5a77e6c0d699b97"],["/certificate/index.html","2489ae1191d187295eed37c8ffd713e2"],["/css/Readme.html","c1421c18e077ab9a9582161d9197e693"],["/css/first.css","46c92499f57f698da32eb4a36fd2b053"],["/css/style.css","2d59f9dd37c74c82655d61628d6517b8"],["/friends/index.html","d376f6559a5c8ef1a14db33590524b0b"],["/images/1.png","47713975c8edffac7f901deb84ad0a82"],["/images/2.png","bbbc15b60b8596346c902348f7f78737"],["/images/3.png","db3a6e91760845c826b7e026a0af0c49"],["/images/Background.jpg","6370679cfc4d00e260601033c7a6a6ed"],["/images/CNVD-1.png","d35e81759c3cfd8e9ba2c8cefb7bae83"],["/images/CNVD-2.png","0b1b520f67a0def654ad359931365843"],["/images/image.png","9a5ef6a4c3db0c60f0297c15cbbf84b5"],["/images/image10.png","6e220fe4852d41bcd940969e37d0a0ee"],["/images/image11.png","3e9cd924cc12d103d3a6cff059ddbcbb"],["/images/image12.png","72ef46a1cfaf64138d18f838168390aa"],["/images/image13.png","4ac9c52dae0ac657a3a2532c750e9397"],["/images/image14.png","efdc2f60e715368baa4571b960c1b340"],["/images/image15.png","69a7ce99b074f5a8d25ea5d661b55142"],["/images/image16.png","1047130314e576e3fd7dc4c2de7f10b4"],["/images/image17.png","1dbfb63f5f942e1022036daf9dee4783"],["/images/image18.png","456c66a145bda965204f1b632c060c5e"],["/images/image19.png","a72a4e02d4df25d85f2570ea4994b0dc"],["/images/image2.png","70dd344e26fb923b6d9e7c78bf658a7e"],["/images/image20.png","2bedcc7d552bb495e6797b6699b84233"],["/images/image21.png","14e7e4b3367b47edddcaced37897abf6"],["/images/image22.png","9a65977f0d70e35f5f337cd3ebdc96e7"],["/images/image23.png","cd2e3135fdba1442194bdc8a99dcdae1"],["/images/image24.png","827ec823680c4232c6b7fbe2883ade07"],["/images/image25.png","88cd9b820de2508fb5f42086e804880e"],["/images/image26.png","39202ee22e4dd262c37e6c7b21db0212"],["/images/image27.png","6adafd42909a3917798db750a255220c"],["/images/image28.png","b631441aa6e7708c962e83c6b526ee07"],["/images/image29.png","c23112878396c039cee775be6dd5eece"],["/images/image3.png","7722c6b65e6c25efd2080d019b88a9ca"],["/images/image30.png","099fb82e1de162c2e061ffd6532db7e8"],["/images/image31.png","0bf63639fe9f1e5aa490261da2ca72db"],["/images/image32.png","5a4dbc0a7b146f805c032f8ace92984a"],["/images/image33.png","3eb51c4d4b6220d1e5be251c7206f8e6"],["/images/image34.png","11b41d4fec5cbdf92bb933ecb38904de"],["/images/image35.png","1d1051731b825380702bd6e9af7b8d63"],["/images/image4.png","0dbff58533fa4bcf4c6e0cd187f66174"],["/images/image5.png","49f65e16cc4e2d7dc8f088f903d472fe"],["/images/image6.png","7f2ad6a13c5f94584f0ea4bf477eb2f6"],["/images/image7.png","cd86f7c2aa6accf4dbeaa2163521b345"],["/images/image8.png","c9973c407adb1f979cbf7570e18f83cf"],["/images/image9.png","6e220fe4852d41bcd940969e37d0a0ee"],["/index.html","6c9aa0af72f7e19bac71153e25e2fd9c"],["/js/app.js","7a2c825eba3f2495f5c0f48cbe70482e"],["/js/plugins/aplayer.js","dbe5eea968969672c52022ed895192a0"],["/js/plugins/parallax.js","8bf0ab10d50243ae87016af576642cdc"],["/js/plugins/rightMenu.js","d9437285263079b1158df42384235b71"],["/js/plugins/rightMenus.js","80d861b1e0937ebecf188793f3705a3a"],["/js/plugins/tags/contributors.js","aec8045335d2753a39a48c34fb019662"],["/js/plugins/tags/friends.js","f372da57b83083859f60ce19b736a695"],["/js/plugins/tags/sites.js","76bf19b80414fbce774acddabf6b1d3e"],["/js/search/hexo.js","8594665377e48c3b406b0149264ebf2d"],["/page/2/index.html","2073ea55d9503f6eb1716289c6333d05"],["/sw-register.js","7704d16b04e387d76f7b4eb648b5403a"],["/tags/AES/index.html","5b51f3e2841a60c317113582c0aa7e21"],["/tags/Active-directory/index.html","3193a935ec01677f1f88f74c52a677d6"],["/tags/Code-Audit/index.html","2a655161609392fd203996011dde7cb6"],["/tags/Credentials/index.html","e640d67ffcefdb25d1f8baa8a024348f"],["/tags/DCSync/index.html","1337e490ea6f894fbe0188cbdfe91438"],["/tags/Decrypt/index.html","6e918185056f4e79ae741789ffde907a"],["/tags/Domain/index.html","d360b25b5fc79cc98112abcb18c8ea4e"],["/tags/Encrypt/index.html","089a0d16a030a279704c61ad17fcee3e"],["/tags/Java/index.html","cbd9c3967333eca12b9fdfe6d34930f2"],["/tags/LDAP/index.html","f61aad16ac8bb3b459c52e829887abe5"],["/tags/Linux/index.html","78883d86b070f38fe62af2104701cf56"],["/tags/Mysql/index.html","d14cd5c911b8834dd44aac06750da29d"],["/tags/OU/index.html","b5430ce077870edf5d688b05b5aaa643"],["/tags/Oracle/index.html","83fdd3b342e44034b6ed569fd3a66a9c"],["/tags/PHP/index.html","ee9ed91d5db388d0a2065a51e3bed888"],["/tags/Persistence/index.html","e348e01af77d28e0875ecf3cfe1a0067"],["/tags/Privilege-Escalation/index.html","0e6f9738680e7129c10939a7a2ba68e1"],["/tags/RID/index.html","f856e8253a17df345cf759244b7b1b33"],["/tags/RSA/index.html","25d66272a8f945ce3dcf4c18a6c2f37d"],["/tags/Redis/index.html","50e341b9368a24eb4e8e931777be9f24"],["/tags/Reverse/index.html","69444386e49b8b3dc4c7d75dd7fdb375"],["/tags/SID/index.html","cda9f0e1dae7f1b8125e687f88851b00"],["/tags/SQL-Injection/index.html","b455bf50f9e06d82c9fe96352296649c"],["/tags/Users/index.html","2a4bae17c4fe20a44998c9721eeef062"],["/tags/Zentao/index.html","e2cac8f7d2b7c9e7e9d57e34135a6504"],["/tags/index.html","2f8f8023eb6a28970601015d48264eaf"],["/tags/user-group/index.html","cabc262d08ddc450daf0f057814dffff"],["/tags/渗透测试/index.html","a3be693f4461e17ac2a8a17888205c18"],["/tags/电子取证/index.html","ee930c91e32b4a8409760c6b3ec84943"],["/tags/禅道/index.html","c1eb4baef117130dac7521d3f08319f9"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
