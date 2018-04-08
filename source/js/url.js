var requestUrl = {
    debug: true,
    debugDomain : 'http://xfjr.ledaikkuan.cn:9191',
    payGateDomain : 'http://ledaikuan.vip',
    getLoginRequestUrl : function(){
        if(requestUrl.debug){
            return requestUrl.debugDomain+"/llm/login/login";
        }else{
            return requestUrl.payGateDomain+"/llm/login/login";
        }
    },
    getFgetPwdRequestUrl : function(){
        if(requestUrl.debug){
            return requestUrl.debugDomain+"/llm/login/fgetPwd";
        }else{
            return requestUrl.payGateDomain+"/llm/login/fgetPwd";
        }
    },
    getPartnerListUrl : function(){
        if(requestUrl.debug){
            return requestUrl.debugDomain+"/llm/login/fgetPwd";
        }else{
            return requestUrl.payGateDomain+"/llm/cp/createProduct";
        }
    }
}