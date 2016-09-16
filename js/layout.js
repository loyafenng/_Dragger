(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(["layout/0.2.0/tmpl/main", "layout/0.2.0/tmpl/menu", "layout/0.2.0/tmpl/login", "search/0.2.0/search",'menu/0.1.0/menu'], _module);
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("layout/0.2.0/layout", ["layout/0.2.0/tmpl/main", "layout/0.2.0/tmpl/menu", "search/0.2.0/search", 'menu/0.1.0/menu'], function (require, exports, module) {
            return _module();
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (Main, Menu, Login, Search,ContextMenu) {
    var layout = {
        attr: {
            skin: "default",
            search: false,
            name: "backend",//系统名称
            sideWidth:'225',//左边侧边栏宽度
            logo: "",
            logoName: "",
            logoIcon: "",
            onMenuClick: function (e, menuData) {//菜单点击时触发
                return true;//菜单点击事件,返回true则继续原操作,返回false停止原操作
            },
            showHeader:true,
            collapsed:false//默认折叠
        }        
    };
    var $wrapper;
    layout.init = function (config) {
        $wrapper = $(config.wrapper);       
        var _conf = $.extend(layout.attr, config);
        if(_conf.sideWidth<225){
            _conf.sideWidth=225;
        }
        if (_conf.collapsed) {
            $wrapper.addClass("collapsed-left");
        }

        if (!_conf.showHeader) {
            $wrapper.addClass("collasped-main");
        }

        $wrapper.append(Main(_conf));

        this.attr.skin = _conf.skin;       

        //hplus.init();

        //增加全局句柄
        window.layout = layout;

        layout.initEvent();

        if (_conf.search) {
            layout.initSearch(_conf.search);
        }
        //layout.skinConfig();

        //layout.initContent();
    };

    layout.initEvent = function () {
        var self=this;
        var o_menu = $wrapper.find("#head_menu_box");
        var o_iframe = $wrapper.find("#main_iframe_box");
        o_menu.on("click", "a", function () {
            //console.log(1);
            var obj = $(this);
            var o_li = obj.parent();
            var _id = obj.attr("data-id");

            o_li.addClass("active");
            o_li.siblings().removeClass("active");

            var newiframe = o_iframe.find("iframe[data-id='" + _id + "']");
            newiframe.addClass("active");
            newiframe.siblings().removeClass("active");
        });
        o_menu.on("click", "a i", function () {          
            var obj = $(this);            
            var _id = obj.parent().attr("data-id");
            layout.removeMenu(_id);
        });


        $(".menu-box .icon-chevron-left").click(function () {
            var o_menu = $("#head_menu_box");
            var ml = o_menu.css("margin-left").replace("px", "") * 1;
            ml = ml + 200;
            if (ml >= 0) {
                ml = 0;
                o_menu.css("margin-left", "0");
            }
            else {
                o_menu.css("margin-left", ml + "px");
            }

        });
        $(".menu-box .icon-chevron-right").click(function () {
            var o_menu = $("#head_menu_box");
            var ml = o_menu.css("margin-left").replace("px", "") * 1;
            ml = ml - 200;
            if (ml >= 0) {
                ml = 0;
                o_menu.css("margin-left", "0");
            }
            else {
                o_menu.css("margin-left", ml + "px");
            }

        });

        $(".left-collapse").click(function () {
            $wrapper.toggleClass("collapsed-left");
            if(!self.attr.showHeader||!self.o_menuBox){
                return ;
            }
            if($wrapper.hasClass('collapsed-left')){
                self.o_menuBox.addClass('login-pic');
                self.o_login.appendTo(self.o_menuBox);
            }else{
                self.o_login.prependTo(self.o_funBox);
                self.o_menuBox.removeClass('login-pic');
            }

            self.o_login.find('.icon-sort-down').removeClass('icon-sort-up');
            self.o_login.find('.login-panel').addClass('none');

        });

        $(".closemenu").click(function () {
            $("#head_menu_box>span:not([role=main])").remove();
            $(".J_iframe:not([role=main])").remove();

            var newmenu = $("#head_menu_box>span[role=main]").addClass("active");            
            $(".J_iframe[role=main]").addClass("active");
            $("#head_menu_box").css("margin-left", "0");
        });

        document.oncontextmenu = function () {
            return false;
        }

        //右键菜单
        var cmenu = new ContextMenu({
            "berth": "span",
            "wrapper": "#head_menu_box",
            "clickType": "right",//left right          
            //"onMenuClick": function (id, text) {

            //},
            "menus": [{ id: '1', text: '刷新' }
                , { id: '2', text: '定位菜单' }
                //, { id: '3', text: '关闭左侧菜单' }
                //, { id: '4', text: '关闭右侧菜单' }
            ],//菜单列表
            "onMenuClick": function (id, text) {
                var _id = cmenu.o_berth.find('a').attr('data-id');
                if (id=="1") {                 
                    layout.refreshPage(_id);
                }
                else if (id == "2") {                   
                    layout.position(_id);                    
                }
            }
        });
      

        layout.drag();
    }

    //登录信息
    layout.initLogin = function (data) {
        var self=this;
        // loginout:"#"
        var cfg={position:'left'};
        data=$.extend(cfg,data);
         var html = Login(data);
        if(data.position=='left'){
            $wrapper.find("#userinfo").html(html);
        }else{
            $wrapper.find('#userinfo').remove();
            self.o_menuBox=$wrapper.find('.main-box .menu-box');
            self.o_funBox=$wrapper.find('.fun-box');
            if (!self.attr.collapsed&&self.attr.showHeader) {
                self.o_login = $(html).prependTo(self.o_funBox);
            } else {
                self.o_login = $(html).appendTo(self.o_menuBox);
                self.o_menuBox.addClass('login-pic');
            }

            $wrapper.on('click','.login',function(){
                $(this).find('.icon-sort-down').toggleClass('icon-sort-up');
                $(this).find('.login-panel').toggleClass('none');
            })
            $wrapper.on('click','.login-panel',function(e){
                e.stopPropagation();
            });
        }
       
        
    };

    //右侧菜单
    layout.initMenu = function (data) {
        var self = this;
        var html = Menu(data);
        var o_menu = $wrapper.find("#leftmenu");
        o_menu.append(html);

        o_menu.on("click", "a", function (e) {
            var o_el = $(this);
            var o_ul = o_el.parents("ul:first");
            var o_li = o_el.parents("li:first");
            var o_child_ul = o_el.find("ul:first");

            o_li.siblings().removeClass("active");


            var _href = o_el.attr("data-href");
            var _id = o_el.attr("data-id");
            var _refresh = (o_el.attr('data-refresh') == "true");

            if (!_href) {
                o_li.toggleClass("active");
                return true;
            }
            else {
                o_li.addClass("active");
            }
            if (self.attr.onMenuClick) {
                var menuData = {
                    url: _href,
                    id: _id,
                    text: o_el.text()
                }
                if (self.attr.onMenuClick(e, menuData)) {
                    layout.addMenu(o_el.text(), _href, _id, _refresh);
                }               
            }
            else {
                layout.addMenu(o_el.text(), _href, _id, _refresh);
            }
           
            //if (o_ul.hasClass("nav-second-level") || o_ul.hasClass("nav-third-level")) {
            //    var _href = o_el.attr("data-href");
            //    var _id = o_el.attr("data-id");
            //    var _refresh = (o_el.attr('data-refresh') == "true");

            //    if (!_href) {                  
            //        o_li.toggleClass("active");
            //        return true;
            //    }
            //    else {
            //        o_li.addClass("active");
            //    }
            //    layout.addMenu(o_el.text(), _href, _id, _refresh);
            //}
            //else {            
            //    o_li.toggleClass("active");               
            //}           
          
          
        });
        ////菜单初始化
        //metisMenu.init();

        ////tab初始化
        //contabs.init();

    };

    //热门菜单
    layout.initHotMenu = function (data) {  
        var obj = $("#hotlinkmenu");
        $.each(data, function (i, v) {
            obj.append('<a href="' + v.url + '" class="item" target="_blank">' + v.text + '</a>');
        });      
    }

     //工具类icon,
    layout.initTools = function (data) {
        var obj = $("#toolsmenu");
        $.each(data, function (i, v) {
            if (v.type == "icon") {
                var imgobj = $('<i class=" icon iconlabel-lg" >' + v.alt + '</i>');
                obj.append(imgobj);
            } else {
                var imgobj = $('<img class="item" src="' + v.src + '" target="_blank" alt="' + v.alt + '" />');
                obj.append(imgobj);
            }
            imgobj.click(v.res);
        });
    }

    //新增菜单
    layout.addMenu = function (title, url, id, refresh) {
        var main_layout;
        if (window.layout) {
            main_layout = window.layout;
        }
        else {
            main_layout = window.parent.layout;
            return main_layout.addMenu(title, url, id);
        }

        var id = id || url;
        if (!id) {
            return;
        }

        var o_menu = $("#head_menu_box");
        var o_iframe = $("#main_iframe_box");
        var newmenu = o_menu.find("a[data-id='" + id + "']");
        var newiframe = o_iframe.find("iframe[data-id='" + id + "']");     

        if (newmenu.length > 0) {
            var o_li = newmenu.parent();
            o_li.addClass("active");
            o_li.siblings().removeClass("active");
            newiframe.addClass("active");
            newiframe.siblings().removeClass("active");

            if (refresh) {
                newiframe.get(0).contentWindow.location.reload();
            }          
        }
        else {
            o_menu.find("span").removeClass("active");
            o_iframe.find("iframe").removeClass("active");

            newmenu = $('<span class="active"><a href="javascript:;" data-id="{1}">{0}<i class="icon-remove-sign"></i></a></span>'.replace('{0}', title).replace('{1}', id)); 
            o_menu.append(newmenu);

            newiframe = $('<iframe class="J_iframe active" src="{0}" frameborder="0" data-id="{1}" seamless=""></iframe>'.replace('{0}', url).replace('{1}', id));
            o_iframe.append(newiframe);
        }

       
        layout.reSizeMenu(newmenu);
        //clientWidth
    };

    layout.removeMenu = function (id) {
        var o_menu = $("#head_menu_box");
        var o_iframe = $("#main_iframe_box");       
        var o_li = o_menu.find("a[data-id='" + id + "']").parent();
        var hasactive = o_li.hasClass("active");
        o_li.remove();
        var newiframe = o_iframe.find("iframe[data-id='" + id + "']");
        newiframe.remove();

        if (hasactive) {
            var newmenu = o_menu.find("span").last();
            newmenu.addClass("active");
            o_iframe.find("iframe").last().addClass("active");

            layout.reSizeMenu(newmenu);
        }
    }

    layout.reSizeMenu = function (obj) {
        var o_menu = $("#head_menu_box");

        var cw = o_menu.parent().width();
        var ol = obj.get(0).offsetLeft;
        var ow = obj.get(0).offsetWidth;
        var oml = o_menu.position().left + o_menu.get(0).offsetLeft;

        var ry = 100;//冗余
        var cy = ol + ow - cw - oml + ry;
        var cl = oml - ol;

        if (cy > 0) {
            o_menu.css("margin-left", -cy + "px");
        }
        else if (ol < 0) {
            o_menu.css("margin-left", cl + "px");
        }
        else {
            o_menu.css("margin-left", "0");
        }
    }
    
    layout.setSkin = function (skinname) {
        this.attr.skin = skinname;
        $(".J_iframe").each(function () {
            //$(this.contentWindow.document).trigger("skin.reset", skinname);
            this.contentWindow.module && this.contentWindow.module.setSkin && this.contentWindow.module.setSkin(skinname);
        });
    };

    layout.getSkin = function () {
        return this.attr.skin;
    }

    //菜单左右大小拖拽配置
    layout.drag = function () {
        var isstart = false;
        var startleft = 0;
        var o_bar = $(".split-bar");
        var o_left = $(".left-box");
        var o_main = $(".main-box");
        o_bar.on("mousedown", function (e) {
            startleft = e.offsetX;
            isstart = true;
            o_bar.css("left", 0);
            o_bar.addClass("draging");
        });
        $(document).on("mouseup", function (e) {
            if (isstart) {
                isstart = false;
                var _left = e.screenX - startleft;
                o_bar.removeClass("draging");
                o_bar.css("left", _left + "px");
                o_left.css("width", (_left + 5) + "px");
                o_main.css("margin-left", (_left + 5) + "px");
            }
        });

        $(document).on("mousemove", function (e) {
            if (isstart) {
                var _left = e.screenX - startleft + 5;
                o_left.css("width", _left + "px");
                o_main.css("margin-left", _left + "px");
            }
        });
    };

    layout.initSearch = function (opt) {
        var _conf = {
            showTrigger: "search",
            berth: ".search-bar input",
            textField: "info",
            align:"bottom center",
            cache: true,//是否缓存数据   
            width:"265px",
            height: "300px"
        }
        $.extend(_conf, opt);     
        var search = new Search(_conf);      
    }

    layout.refreshPage = function (id) {
        var newiframe = $("#main_iframe_box").find("iframe[data-id='" + id + "']");
        newiframe.get(0).contentWindow.location.reload();
    }

    layout.position=function (id) {
        var o_menu = $wrapper.find("#leftmenu");
        var o_el = o_menu.find('[data-id="' + id + '"]');
        var o_li = o_el.parents("li:first");
        var o_ul = o_el.parents("ul:first");
        o_li.addClass('active');
        o_li.siblings().removeClass('active');

        if (o_ul.hasClass('nav-second-level')) {
            var o_pli = o_ul.parents("li:first");
            o_pli.addClass('active');
            o_pli.siblings().removeClass('active');
        }
        else if (o_ul.hasClass('nav-third-level')) {
            var o_pli = o_ul.parents("li:first");
            o_pli.addClass('active');
            o_pli.siblings().removeClass('active');

            var o_pul = o_pli.parents("ul:first");
            var o_ppli = o_pul.parents("li:first");
            o_ppli.addClass('active');
            o_ppli.siblings().removeClass('active');
        }
    }

    return layout;
})