﻿'use strict';
!function () {
    //obj.params.jsFile     选择JS文件  
    let path = "admin/js/1688/买家账户/"
    switch (obj.params.jsFile) {
        case "js01": Tool.scriptArr([path + '修改.js']); break;
        default: Tool.scriptArr(['admin/js/1688/common_登录.js',path + '首页.js']); break;
    }
}();