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
            url = 'app';
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
    debug: false,
    debugDomain : 'http://test.yanmachina.com',
    payGateDomain : 'http://lm.yanmachina.com',
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
        loginUrl                   : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain() //登录
    },
    appUrls : {
        "listProductUrl"           : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//获取产品列表
        "listProductRankUrl"       : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//获取全部产品排序
        "listProductUpdateRankUrl" : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新产品排序
        "createAppUrl"             : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//创建应用
        "updateAppUrl"             : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新应用
        "updateProductFee"         : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新合作产品额度费率
        "updateCharacterUrl"       : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新产品特性信息
        "updateApplyUrl"           : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新产品申请信息
        "getAProductInfoUrl"       : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//合作方信息获取
        "updateProductStatusUrl"   : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新产品状态
        "updateProductShowUrl"     : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//更新产品特定展示状态
        "getPropertyConfigUrl"     : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(), //系统参数
        "addPropertyConfigUrl"     : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(), //系统参数
    },
    partnerUrls : {
        "listPartnerUrl"           : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//获取所有合作方
        "createPartnerUrl"         : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//创建合作方
        "updatePartnerUrl"         : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//修改合作方
        "getAPartnerInfoUrl"       : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain()//获取某个合作方
    },
    fastCreateUrl                  : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),//快速创建应用
    uploadFileUrl                  : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/f' : 'http://file.yanmachina.com',//文件上传
    cacheFileUrl                   : ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/cacheFile' : 'http://106.14.152.47:8081/lm/c/cacheFile',//文件上传--快速创建应用
    pvUvUrls: {
        list7DayHourPVUV:   ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),
        list7DayActionPVUV: ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),
        listRecentGeneral:  ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),
        list7DayFrom:       ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),
        list7DayPlatform:   ajaxUrlFlag.debug ? ajaxUrlFlag.getDomain()+'/lm/c/i' : ajaxUrlFlag.getDomain(),
    }
}
