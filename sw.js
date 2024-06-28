/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/2022/02/21/Java学习-IO流/index.html","d5f3471a938d50b04702cdf82a432708"],["/2022/10/18/Burp爆破识别验证码/index.html","3f5e0b1feccd987ced638925ac1d20c8"],["/2022/11/16/Oracle报错解决-ORA-12537/index.html","7543219f85609395febe96bccb223e7c"],["/2023/01/03/SID-RID/index.html","ec72b8a8e8e83e06e194a3f8ecc49454"],["/2023/01/05/微信聊天取证/index.html","f878391838b68b44673bbf4c0614291b"],["/2023/03/07/Machine-user-Domain-user/index.html","964fd886274af7bab73c75a099a27b2c"],["/2023/03/26/Normal-domain-user-add-machine/index.html","ebbfa2ab2646dbc415dded71613cfce9"],["/2023/03/26/active-directory/index.html","f5c810b5bf79941a08c2046305d77753"],["/2023/03/27/Domain-user-group/index.html","02481b621eb0c3ae07bcfc42b0e7a95c"],["/2023/03/28/Organizational-unit/index.html","39fc6b9d5d48dcec86366ef564fb609f"],["/2023/04/01/DCSync/index.html","fa4ce45fd1c8ff4a04470c3445cdc2f9"],["/2023/11/28/PHP-Code-Audit-SQL-Injection/index.html","1de8813792227c44f17f000e13f230b6"],["/2024/05/07/Redis服务排查/index.html","b09c0c55db462f7001fb098d0d9a463b"],["/2024/05/08/Mysql服务排查/index.html","56d2333bcf48d651dff14fe681cef95a"],["/2024/05/31/Linux-backdoor/index.html","b27396f00dd7ddb0bd2f3915f1796e66"],["/404.html","0dccb86f259dfc4222f9663d94c8fbfc"],["/about/index.html","1100df960801fc39eb6200c684985ac3"],["/archives/2022/02/index.html","322c7457e5905590ac3a957559b0695f"],["/archives/2022/10/index.html","294114cdde4d54eabe02ef4a747d4317"],["/archives/2022/11/index.html","302c69c66a949fee7b14f74f895d3314"],["/archives/2022/index.html","a61c94424d24fdf94cee988c62033286"],["/archives/2023/01/index.html","c003febaa99912b40e0bb0a530d6264d"],["/archives/2023/03/index.html","41fe90c11bc6dfed8aca91cee7e25cc5"],["/archives/2023/04/index.html","62e8e481c9c5830ef2cfcb1d0bc7f425"],["/archives/2023/11/index.html","36b2587280dcfbcb88aba21255a40dc7"],["/archives/2023/index.html","959defcf99b882744b90241869786f17"],["/archives/2024/05/index.html","dd73a354062fa969736d6f4c34d4265a"],["/archives/2024/index.html","aad039736740bafdd6b2ce8b3a1dbf97"],["/archives/index.html","afda12c9de7ba16bc6cd37ef55bd042d"],["/archives/page/2/index.html","8509aaab0c9a382aeebc07753be9260a"],["/categories/Active-directory-pentesting/index.html","895e67502550e7a216f0161fddcaaae1"],["/categories/Code-Audit/index.html","7c4533564c075e61d3ced6837970fa23"],["/categories/Emergency-response/index.html","8561653f76ac07ed02de2c152fa8f827"],["/categories/index.html","29124d80313a1eef0f2fd1c9d382e905"],["/categories/permission-maintenance/index.html","5e5a53893a65e3c1788f74f5c0771456"],["/categories/代码学习/index.html","8fe2591e621ed2551948ff0c4bf4fb53"],["/categories/实用技巧/index.html","cadd2e1874ae7ae3a5314a6c456b5fff"],["/certificate/index.html","381b55d849d150eb08fb2f62358a7259"],["/css/Readme.html","c1421c18e077ab9a9582161d9197e693"],["/css/first.css","46c92499f57f698da32eb4a36fd2b053"],["/css/style.css","2d59f9dd37c74c82655d61628d6517b8"],["/faqs/index.html","ab09acd7881c5c6c49f69da079977302"],["/friends/index.html","0700088ec0b96df8a6d3353996602af2"],["/images/Background.jpg","6370679cfc4d00e260601033c7a6a6ed"],["/images/CNVD-1.png","d35e81759c3cfd8e9ba2c8cefb7bae83"],["/images/CNVD-2.png","0b1b520f67a0def654ad359931365843"],["/images/image.png","9a5ef6a4c3db0c60f0297c15cbbf84b5"],["/images/image10.png","6e220fe4852d41bcd940969e37d0a0ee"],["/images/image11.png","3e9cd924cc12d103d3a6cff059ddbcbb"],["/images/image12.png","72ef46a1cfaf64138d18f838168390aa"],["/images/image13.png","4ac9c52dae0ac657a3a2532c750e9397"],["/images/image14.png","efdc2f60e715368baa4571b960c1b340"],["/images/image15.png","69a7ce99b074f5a8d25ea5d661b55142"],["/images/image16.png","1047130314e576e3fd7dc4c2de7f10b4"],["/images/image17.png","1dbfb63f5f942e1022036daf9dee4783"],["/images/image18.png","456c66a145bda965204f1b632c060c5e"],["/images/image19.png","a72a4e02d4df25d85f2570ea4994b0dc"],["/images/image2.png","70dd344e26fb923b6d9e7c78bf658a7e"],["/images/image20.png","2bedcc7d552bb495e6797b6699b84233"],["/images/image21.png","14e7e4b3367b47edddcaced37897abf6"],["/images/image22.png","9a65977f0d70e35f5f337cd3ebdc96e7"],["/images/image23.png","cd2e3135fdba1442194bdc8a99dcdae1"],["/images/image24.png","827ec823680c4232c6b7fbe2883ade07"],["/images/image25.png","88cd9b820de2508fb5f42086e804880e"],["/images/image3.png","7722c6b65e6c25efd2080d019b88a9ca"],["/images/image4.png","0dbff58533fa4bcf4c6e0cd187f66174"],["/images/image5.png","49f65e16cc4e2d7dc8f088f903d472fe"],["/images/image6.png","7f2ad6a13c5f94584f0ea4bf477eb2f6"],["/images/image7.png","cd86f7c2aa6accf4dbeaa2163521b345"],["/images/image8.png","c9973c407adb1f979cbf7570e18f83cf"],["/images/image9.png","6e220fe4852d41bcd940969e37d0a0ee"],["/index.html","110c9a4358088afc22fbdb1c13b4d5c7"],["/js/app.js","7a2c825eba3f2495f5c0f48cbe70482e"],["/js/plugins/aplayer.js","dbe5eea968969672c52022ed895192a0"],["/js/plugins/parallax.js","8bf0ab10d50243ae87016af576642cdc"],["/js/plugins/rightMenu.js","d9437285263079b1158df42384235b71"],["/js/plugins/rightMenus.js","80d861b1e0937ebecf188793f3705a3a"],["/js/plugins/tags/contributors.js","aec8045335d2753a39a48c34fb019662"],["/js/plugins/tags/friends.js","f372da57b83083859f60ce19b736a695"],["/js/plugins/tags/sites.js","76bf19b80414fbce774acddabf6b1d3e"],["/js/search/hexo.js","8594665377e48c3b406b0149264ebf2d"],["/page/2/index.html","ddefe05e67a1e9a9032df9f879468f36"],["/sw-register.js","7836c7c5e0c2dbb4715a093b9fdaab69"],["/tags/Active-directory/index.html","c1c8b2f7056609d274386ab7e18ec296"],["/tags/Code-Audit/index.html","05e78dfdb2003be10201dec06467a0ed"],["/tags/DCSync/index.html","97ac1e797a9b0dff16e002c041b77dbe"],["/tags/Domain/index.html","33272c490d8fe46ed6419fbb06a8150d"],["/tags/Java/index.html","deb13e035c8918ce5bca5e9ff8834bc6"],["/tags/LDAP/index.html","068f26f451bc463496f348a77194ba94"],["/tags/Linux/index.html","978414b28110d994f849bce337e3c978"],["/tags/Mysql/index.html","3b427b0dde9dcaf21ec264d3e4f57757"],["/tags/OU/index.html","ef02b765ff5d69618f16f3f89e74d1db"],["/tags/Oracle/index.html","ce1e4346fa5ceedb58517e5f9d255145"],["/tags/PHP/index.html","deaf6c0479fb69c45956c71c7b6013e3"],["/tags/RID/index.html","9aa34da194d611377d49a7a42a656e17"],["/tags/Redis/index.html","bcc981f411449544120fd4009fa14043"],["/tags/SID/index.html","d16e69fda856b72fde589db9a4fe39e4"],["/tags/SQL-Injection/index.html","0400c9c48ab183137a40eabf3806b5d8"],["/tags/Users/index.html","caf976bece14bf040b3fc4f012fb0edf"],["/tags/index.html","a9127b81ddbc781f32874c0d6f5c1732"],["/tags/user-group/index.html","8c9ab6e68bacc4a4f81c5a5a59b771b7"],["/tags/渗透测试/index.html","ffc570a90d2dbfad2533918ea21c86e5"],["/tags/电子取证/index.html","bc5fd9db8729942519783ade0254b4d7"]];
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
