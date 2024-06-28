/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/2022/02/21/Java学习-IO流/index.html","4613693a837e556e18ea6c159e9be4a9"],["/2022/10/18/Burp爆破识别验证码/index.html","1f0c6706adceb6dc8ef17eb319ee65bc"],["/2022/11/16/Oracle报错解决-ORA-12537/index.html","820e770619d768cf845eebf50b82460c"],["/2023/01/03/SID-RID/index.html","377300df747f63dbbc9bcf48eb5794bf"],["/2023/01/05/微信聊天取证/index.html","be91f26a73fc5b828f691223099d8afe"],["/2023/03/07/Machine-user-Domain-user/index.html","f1719db7b794b04c2667533615e60c0b"],["/2023/03/26/Normal-domain-user-add-machine/index.html","49ab3660ab1a6fddd625266ec2d515c3"],["/2023/03/26/active-directory/index.html","cac9a2d60eb26cf12a3824da7037a073"],["/2023/03/27/Domain-user-group/index.html","c7d85a075f6accf869bce1054617b2be"],["/2023/03/28/Organizational-unit/index.html","8f39fa6fc6acf2093c59db4a796fcd1c"],["/2023/04/01/DCSync/index.html","28fd4775336f5457e8b50add1c0cfdb0"],["/2023/11/28/PHP-Code-Audit-SQL-Injection/index.html","5ca8113fd300cc063450caf17bc09ed1"],["/2024/05/07/Redis服务排查/index.html","50cdc8cd8780905c41db3e533f5a8748"],["/2024/05/08/Mysql服务排查/index.html","8e0a8a88bd17f6f731d4a83577a13cc1"],["/2024/05/31/Linux-backdoor/index.html","b6ad0e7936d2775af6bf2a1ba8df5868"],["/404.html","cb8ac4981f342e32c3493265d7fe70d4"],["/about/index.html","3748d2e79f814018416e153187bc0123"],["/archives/2022/02/index.html","7f7260410c96f2e14ef901ca08067c95"],["/archives/2022/10/index.html","b90de09eda6c5a6a782bf96f4a5f0d18"],["/archives/2022/11/index.html","1a341714083928c1bba77c6d468d0e49"],["/archives/2022/index.html","4778fcc1ff44e16a21b07b82995df695"],["/archives/2023/01/index.html","19d7c67aefb6969c45d87abb7758080f"],["/archives/2023/03/index.html","a43e4ac9bd593caa34ed9c0680a83d0e"],["/archives/2023/04/index.html","9a16c659885934d7190ff589bc90facb"],["/archives/2023/11/index.html","e705546241fd2346e0f7729462d1219c"],["/archives/2023/index.html","a37b4078a24c10f7789cc77d2d31dbf4"],["/archives/2024/05/index.html","7f3f61fddce421efd97256dd4b730e65"],["/archives/2024/index.html","94a69c56cd805cb9d225be1ba820adce"],["/archives/index.html","b0a9d8b45557d2ee9f19b8bbd2641bd1"],["/archives/page/2/index.html","e2606bad7bfd1daff9017c7fd62ccf5f"],["/categories/Active-directory-pentesting/index.html","182b3c5d0b47b56d9ba696af9bb9c567"],["/categories/Code-Audit/index.html","3fabe3302018579e74b349a50354ecd5"],["/categories/Emergency-response/index.html","43fd3064fd15d55a7bd6ae7f35644019"],["/categories/index.html","d1765de5d103f9b482a29784dddb3ebc"],["/categories/permission-maintenance/index.html","0e411d725f84cde553a068e26b1809d3"],["/categories/代码学习/index.html","2c8ee2848de8039376c2f3021fed0bb4"],["/categories/实用技巧/index.html","0b0f4f170dfb8cf5670d8e7c619e4090"],["/certificate/index.html","e7102e20c7465921aad29010c5ecc4da"],["/css/Readme.html","c1421c18e077ab9a9582161d9197e693"],["/css/first.css","46c92499f57f698da32eb4a36fd2b053"],["/css/style.css","2d59f9dd37c74c82655d61628d6517b8"],["/faqs/index.html","0ada5a8bebd49861441132c351ceff6f"],["/friends/index.html","82c8ec63a2d859445d2b786e1afeee97"],["/images/CNVD-1.png","d35e81759c3cfd8e9ba2c8cefb7bae83"],["/images/CNVD-2.png","0b1b520f67a0def654ad359931365843"],["/images/image.png","9a5ef6a4c3db0c60f0297c15cbbf84b5"],["/images/image10.png","6e220fe4852d41bcd940969e37d0a0ee"],["/images/image11.png","3e9cd924cc12d103d3a6cff059ddbcbb"],["/images/image12.png","72ef46a1cfaf64138d18f838168390aa"],["/images/image13.png","4ac9c52dae0ac657a3a2532c750e9397"],["/images/image14.png","efdc2f60e715368baa4571b960c1b340"],["/images/image15.png","69a7ce99b074f5a8d25ea5d661b55142"],["/images/image16.png","1047130314e576e3fd7dc4c2de7f10b4"],["/images/image17.png","1dbfb63f5f942e1022036daf9dee4783"],["/images/image18.png","456c66a145bda965204f1b632c060c5e"],["/images/image19.png","a72a4e02d4df25d85f2570ea4994b0dc"],["/images/image2.png","70dd344e26fb923b6d9e7c78bf658a7e"],["/images/image20.png","2bedcc7d552bb495e6797b6699b84233"],["/images/image21.png","14e7e4b3367b47edddcaced37897abf6"],["/images/image22.png","9a65977f0d70e35f5f337cd3ebdc96e7"],["/images/image23.png","cd2e3135fdba1442194bdc8a99dcdae1"],["/images/image24.png","827ec823680c4232c6b7fbe2883ade07"],["/images/image25.png","88cd9b820de2508fb5f42086e804880e"],["/images/image3.png","7722c6b65e6c25efd2080d019b88a9ca"],["/images/image4.png","0dbff58533fa4bcf4c6e0cd187f66174"],["/images/image5.png","49f65e16cc4e2d7dc8f088f903d472fe"],["/images/image6.png","7f2ad6a13c5f94584f0ea4bf477eb2f6"],["/images/image7.png","cd86f7c2aa6accf4dbeaa2163521b345"],["/images/image8.png","c9973c407adb1f979cbf7570e18f83cf"],["/images/image9.png","6e220fe4852d41bcd940969e37d0a0ee"],["/index.html","669077ae87615a83ac98b286a1a1f512"],["/js/app.js","7a2c825eba3f2495f5c0f48cbe70482e"],["/js/plugins/aplayer.js","dbe5eea968969672c52022ed895192a0"],["/js/plugins/parallax.js","8bf0ab10d50243ae87016af576642cdc"],["/js/plugins/rightMenu.js","d9437285263079b1158df42384235b71"],["/js/plugins/rightMenus.js","80d861b1e0937ebecf188793f3705a3a"],["/js/plugins/tags/contributors.js","aec8045335d2753a39a48c34fb019662"],["/js/plugins/tags/friends.js","f372da57b83083859f60ce19b736a695"],["/js/plugins/tags/sites.js","76bf19b80414fbce774acddabf6b1d3e"],["/js/search/hexo.js","8594665377e48c3b406b0149264ebf2d"],["/page/2/index.html","0e0c5b2e275945b0363cf23c7f8cfffd"],["/sw-register.js","383fbe4ebf9fc030c2d252df69c6a6b2"],["/tags/Active-directory/index.html","f71e2c7261526ec0a6de12c4edd1de6b"],["/tags/Code-Audit/index.html","6304c66bf2894271722041e7e2fd7c45"],["/tags/DCSync/index.html","2c157f9c75ef5164cca2a9bc5094ff84"],["/tags/Domain/index.html","a20d7d70435513e43f7322deae84474b"],["/tags/Java/index.html","85a7e64132966c037f145056b7a56b5e"],["/tags/LDAP/index.html","1befb424d6acc96f491c21602a3bc294"],["/tags/Linux/index.html","b54b880367282d02774e461587d82caf"],["/tags/Mysql/index.html","8c2886e9040659c182ce456a9ba41e88"],["/tags/OU/index.html","fdb714672c01f6acd35f60871c93b803"],["/tags/Oracle/index.html","e58370e6ebd81a395f194db76123a354"],["/tags/PHP/index.html","ebe5c2b165a680342442db28a13208a0"],["/tags/RID/index.html","679a7d307ca656ededab0e746ef5bbd1"],["/tags/Redis/index.html","66b80bae869ef5a08547774ff0962a49"],["/tags/SID/index.html","0adc05f89ee24d3ca774812eac39680c"],["/tags/SQL-Injection/index.html","f3e11e78a57e5354b171b336d9e5c227"],["/tags/Users/index.html","34ecc9644bbede3f5c93aaddfd6456b6"],["/tags/index.html","a52d34e71f365c24b0ead22298b51595"],["/tags/user-group/index.html","5a88a919377f16fabe3920cf8fbca498"],["/tags/渗透测试/index.html","f0d5a6b413a80029844ca7ea34e46daf"],["/tags/电子取证/index.html","0d6a78aeeafdeeed9d75433f8b947141"]];
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
