var notfound = {
    rel : 'source/page/404.html',
    init : function(){
        window.location.replace("source/page/404.html");
    }
};               //404 page

var settings = {
    partialCache : {},
    contentWrapper : function(){
        var contentWrapper = document.getElementById('contentWrapper');
        return contentWrapper;
    }()
};

var miniSPA = {
    changeURL : function(){
        var url = location.hash.replace('#','');
        if(url === ''){
            url = 'home';
        }
        if(!window[url]){
            url = 'notfound';
        }

        miniSPA.ajaxRequest(window[url].partial,'GET','',function(status,page){
            if(status == 404){
                url = 'notfound';
                miniSPA.ajaxRequest(window[url].partial,'GET','',function(status,page404){
                    settings.contentWrapper.innerHTML = page404;
                    miniSPA.initFunc(url);
                });
            }else{
                settings.contentWrapper.innerHTML = page;
                miniSPA.initFunc(url);

            }
        });
    },
    ajaxRequest : function(url,method,data,callback){
        if(settings.partialCache[url]){
            callback(200,settings.partialCache[url]);
        }else{
            var xmlhttp;
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
                xmlhttp.open(method,url,true);
                if(method === 'POST'){
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                }
                xmlhttp.send(data);
                xmlhttp.onreadystatechange = function(){
                    if(xmlhttp.readyState == 4){//请求已完成，且响应就绪
                        switch(xmlhttp.status){
                            case 404:
                                url = 'notfound';
                                break;
                            default:
                                var parts = url.split('.');
                                if(parts.length>1 && parts[parts.length-1] == 'html'){
                                    settings.partialCache[url] = xmlhttp.responseText;
                                }
                        }
                        callback(xmlhttp.status,xmlhttp.responseText);
                    }
                }
            }
            else{
                alert('抱歉,您的浏览器版本太低了不能支持页面应用，请更换或更新浏览器.');
                callback(404,{});
            }
        }
    },
    render : function(url){
        settings.rootScope = window[url];
        miniSPA.refresh(settings.contentWrapper,settings.rootScope);
    },
    refresh : function(node, scope){
        var children = node.childNodes;
        if(node.nodeType != 3){
            for(var k=0; k<node.attributes.length; k++){
                node.setAttribute(node.attributes[k].name, miniSPA.feedData(node.attributes[k].value, scope));
            }
            var childrenCount = children.length;
            for(var j=0; j<childrenCount; j++){
                if(children[j].nodeType != 3 && children[j].hasAttribute('data-repeat')){
                    var item = children[j].dataset.item;
                    var repeat = children[j].dataset.repeat;
                    children[j].removeAttribute('data-repeat');
                    var repeatNode = children[j];
                    for(var prop in scope[repeat]){
                        repeatNode = children[j].cloneNode(true);
                        node.appendChild(repeatNode);
                        var repeatScope = scope;
                        var obj = {};
                        obj.key = prop;
                        obj.value = scope[repeat][prop];
                        repeatScope[item] = obj;
                        miniSPA.refresh(repeatNode,repeatScope);
                    }
                    node.removeChild(children[j]);
                }else{
                    miniSPA.refresh(children[j],scope);
                }
            }
        }
        else{
            node.textContent = miniSPA.feedData(node.textContent, scope);
        }
    },
    feedData : function(template, scope){
        return template.replace(/\{\{([^}]+)\}\}/gmi, function(model){
            var properties = model.substring(2,model.length-2).split('.');
            var result = scope;
            for(var n in properties){
                if(result){
                    switch(properties[n]){
                        case 'key':
                            result = result.key;
                            break;
                        case 'value':
                            result = result.value;
                            break;
                        case 'length':
                            var length = 0;
                            for(var x in result) length ++;
                            result = length;
                            break;
                        default:
                            result = result[properties[n]];
                    }
                }
            }
            return result;
        });
    },
    initFunc : function(partial){
        var fn = window[partial].init;
        if(typeof fn === 'function') {
            fn();
        }
    }
};

miniSPA.ajaxRequest('source/page/404.html', 'GET','',function(status, partial){
    settings.partialCache.notfound = partial;
});




var ajaxUrlFlag = {
    debug: true,
    debugDomain : 'http://test.yanmachina.com',
    payGateDomain : 'http://www.yanmachina.com/#',
    getDomain : function(){
        if(ajaxUrlFlag.debug){
            return ajaxUrlFlag.debugDomain;
        }else{
            return ajaxUrlFlag.payGateDomain;
        }
    }
}
var ajaxUrl = {
    ua: 'YANMA_H5_SIGN',
    signKey: '68352e79616e6d616368696e612e636f6d',
    cryptoKey: '1234567812345678',
    cryptoIv: '1234567812345678',
    loginUrls: {
        loginUrl: ajaxUrlFlag.getDomain() + '/lm/c/i' // 登录
    },
    appUrls : {
        "listProductUrl"         : ajaxUrlFlag.getDomain()+'/lm/c/i',//产品列表url,
        "createAppUrl"           : ajaxUrlFlag.getDomain()+'/lm/c/i',//创建应用url,
        "updateProductFee"       : ajaxUrlFlag.getDomain()+'/lm/c/i',//更新合作产品额度费率,
        "createProductUrl"       : ajaxUrlFlag.getDomain()+'/llm/cp/createProduct',//创建产品url,
        "updateProductUrl"       : ajaxUrlFlag.getDomain()+'/llm/cp/updateProduct',//修改产品url
        // "createProductDetailUrl" : ajaxUrlFlag.getDomain()+'/llm/cp/createProductDetail',//创建产品明细url
        // "updateProductDetailUrl" : ajaxUrlFlag.getDomain()+'/llm/cp/updateProductDetail',//修改产品明细url
        "updateCharacterUrl"     : ajaxUrlFlag.getDomain()+'/lm/c/i',//更新产品特性信息
        "updateApplyUrl"         : ajaxUrlFlag.getDomain()+'/lm/c/i',//更新产品申请信息
        // "getAProductInfoUrl"     : ajaxUrlFlag.getDomain()+'/llm/cp/findProduct',//获取某个产品所有信息url
        "getAProductInfoUrl"     : ajaxUrlFlag.getDomain()+'/lm/c/i',//合作方信息获取
        "setProductStatusUrl"    : ajaxUrlFlag.getDomain()+'/llm/cp/updateProductStatus',//设置产品状态url

        "getPropertyConfigUrl"      : ajaxUrlFlag.getDomain()+'/lm/c/i', //系统参数
    },
    partnerUrls : {
        "listPartnerUrl"     : ajaxUrlFlag.getDomain()+'/lm/c/i',//获取所有合作方url,
        "createPartnerUrl"   : ajaxUrlFlag.getDomain()+'/lm/c/i',//创建合作方url,
        // "updatePartnerUrl"   : ajaxUrlFlag.getDomain()+'/llm/partner/updatePartner',//修改合作方url,
        "updatePartnerUrl"   : ajaxUrlFlag.getDomain()+'/lm/c/i',//修改合作方url,
        // "getAPartnerInfoUrl" : ajaxUrlFlag.getDomain()+'/llm/partner/findPartner'//获取某个合作方url
        "getAPartnerInfoUrl" : ajaxUrlFlag.getDomain()+'/lm/c/i'//获取某个合作方url
    },
    bannerUrls : {
        "listBannerUrl"      : ajaxUrlFlag.getDomain()+'/llm/banner/listBanner',//获取banner列表url,
        "createBannerUrl"    : ajaxUrlFlag.getDomain()+'/llm/banner/createBanner',//创建bannerurl,
        "updateBannerUrl"    : ajaxUrlFlag.getDomain()+'/llm/banner/updateBanner',//修改bannerurl,
        "getABannerInfoUrl"  : ajaxUrlFlag.getDomain()+'/llm/banner/findBanner',//获取某个bannerurl,
        "setBannerStatusUrl" : ajaxUrlFlag.getDomain()+'/llm/banner/findBanner'//设置banner状态url
    },
    uploadFileUrl : ajaxUrlFlag.getDomain()+'/lm/c/f',//文件上传url
    // uploadFileUrl : 'http://192.168.199.142:8080/lm/c/f',//文件上传url
    // loginUrl : ajaxUrlFlag.getDomain()+'/llm/login/login',//文件上传url
    forgetPwd : ajaxUrlFlag.getDomain()+'/llm/login/fgetPwd'//文件上传url
}
