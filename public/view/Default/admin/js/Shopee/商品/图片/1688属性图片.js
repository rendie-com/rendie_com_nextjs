'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页          
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        obj.params.database = obj.params.database ? obj.params.database : '1688属性图'//数据表
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/商品/图片/" + obj.params.database,
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/商品/图片/" + obj.params.database + ".db"],
                database: "shopee/商品/图片/" + obj.params.database,
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = this.b06()
        let data = [{
            action: "sqlite",
            database: "shopee/商品/图片/" + obj.params.database,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/商品/图片/" + obj.params.database,
            sql: "select " + Tool.fieldAs("id,fromid,hash,width,height,size,addtime,src,tw_watermark,my_watermark,br_watermark") + " FROM @.table" + where + Tool.limit(10, obj.params.page),
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let html1 = "", arr = t[1]
        for (let i = 0; i < arr.length; i++) {
            html1 += '\
              <tr>\
                  <td>'+ this.b02(arr[i].src) + '</td>\
                  <td>'+ this.b02(arr[i].tw_watermark) + '</td>\
                  <td>'+ this.b02(arr[i].my_watermark) + '</td>\
                  <td>'+ this.b02(arr[i].br_watermark) + '</td>\
                  <td>'+ arr[i].fromid + '</td>\
                  <td>'+ arr[i].hash + '</td>\
                  <td>'+ arr[i].width + '</td>\
                  <td>'+ arr[i].height + '</td>\
                  <td>'+ arr[i].size + '</td>\
                  <td>'+ Tool.js_date_time2(arr[i].addtime) + '</td>\
              </tr>'
        }
        ////////////////////////////////////////////////////////////
        let html = Tool.header2(obj.params.jsFile) + '\
        <div class="p-2">\
            <div style="top: 6px;position: relative;">'+ this.b01() + '</div>\
            <ul class="makeHtmlTab" id="picTab" style="padding-left: 20px;">\
                <li'+ (obj.params.database == "shopee首图" ? ' class="hover"' : "") + ' onclick="Tool.main(\'?jsFile=js28&database=shopee首图\')">shopee首图</li>\
                <li'+ (obj.params.database == "shopee放大镜图" ? ' class="hover"' : "") + ' onclick="Tool.main(\'?jsFile=js28&database=shopee放大镜图\')">shopee放大镜图</li>\
                <li'+ (obj.params.database == "1688属性图" ? ' class="hover"' : "") + ' onclick="Tool.main(\'?jsFile=js30&database=1688属性图\')">1688属性图片</li>\
            </ul>\
            '+ this.b04() + '\
            <table class="table align-top table-hover center">\
                <thead class="table-light">'+ this.b03() + '</thead>\
                <tbody>'+ html1 + '</tbody>\
            </table>' + Tool.page(t[0][0].total, 10, obj.params.page) + '\
        </div>'
        Tool.html(null, null, html)
    },
    ///////////////////////////////////////////////////////////////
    b01: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'?jsFile=js07\');"><a class="dropdown-item pointer">*把【全球商品】的图片上传到Shopee平台</a></li>\
            <li onClick="Tool.openR(\'?jsFile=js29\');" title="使用1688属性图：1688 &gt; 采集箱 &gt; 【1688】主商品列表 &gt; 手动审核1688状态 &gt; 使用1688属性图"><a class="dropdown-item pointer">*把【使用1688的图片】上传到Shopee平台</a></li>\
        </ul>'
    },
    b02: function (pic) {
        if (pic) {
            return "<a href=\"https://s-cf-sg.shopeesz.com/file/" + pic + "\" target=\"_blank\"><img src=\"https://s-cf-sg.shopeesz.com/file/" + pic + "_tn\" class=\"img-fluid rounded\" style=\"height:100px;\"></a>"
        }
        else {
            return "";
        }

    },
    b03: function () {
        let html = '\
          <tr>\
            <th class="w110">图片</th>\
            <th class="w110">台湾虾皮</th>\
            <th class="w110">马来西亚</th>\
            <th class="w110">巴西</th>\
            <th>详情ID</th>\
            <th>hash值</th>\
            <th>宽</th>\
            <th>高</th>\
            <th>大小</th>\
            <th class="w170">时间</th>\
          </tr>'
        return html;
    },
    b04: function () {
        return '\
          <div class="input-group w-50 m-2">\
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ obj.params.field + '">' + this.b05(obj.params.field) + '</button>\
              <ul class="dropdown-menu">\
                  <li class="dropdown-item pointer" onclick="fun.c01(1)" value="1">详情ID</li>\
                  <li class="dropdown-item pointer" onclick="fun.c01(2)" value="2">hash值</a></li>\
                  <li class="dropdown-item pointer" onclick="fun.c01(3)" value="2">图片地址</a></li>\
              </ul>\
              <input type="text" class="form-control" id="searchword" value="'+ obj.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
              <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
          </div>'
    },
    b05: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "详情ID"; break;
            case "2": name = "hash值"; break;
            case "3": name = "图片地址"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b06: function () {
        let arr = [];
        if (obj.params.searchword) {
            switch (obj.params.field) {
                case "1": arr.push("@.fromid=" + obj.params.searchword); break;//详情ID
                case "2": arr.push("@.hash='" + obj.params.searchword + "'"); break;//hash值
                case "3": arr.push("@.src='" + obj.params.searchword + "'"); break;//图片地址
            }
        }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    ///////////////////////////////////////////////
    c01: function (val) {
        let name = this.b05("" + val);
        $("#field").html(name).val(val);
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("?jsFile=" + obj.params.jsFile + "&page=1&field=" + field + "&searchword=" + searchword);
        }
        else { alert("请输入搜索内容"); }
    },

}
fun.a01();