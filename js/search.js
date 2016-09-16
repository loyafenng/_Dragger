(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['tooltip/0.3.0/tooltip', 'jsondb/0.1.0/jsondb', 'css!search/0.2.0/search'], _module);
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("search/0.2.0/search", ['tooltip/0.3.0/tooltip', 'jsondb/0.1.0/jsondb', 'search/0.2.0/search.css'], function (require, exports, module) {         
            return _module(require('tooltip/0.3.0/tooltip'), require('jsondb/0.1.0/jsondb'));
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (Module, JsonDB) {
    /*
    * Created by 李岩岩 on 2016/04/14
    * 弹出提示框
    * 触发方式:方法,事件
    * 位置
    * 关闭方式 
    * 箭头
    */
    var Search = Module.extend({
        initialize: function (config) {
            //init super
            Search.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Search.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            
            self.__searchEvent();

            self._dbdata = new JsonDB({
                maxSize: self.attr.cacheCount,
                modal:3
            });

            self.on("item.click", function (e, rowdata) {
                self.attr.onItemClick(rowdata);
            });

            self.on("item.select", function (e, rowdata) {
                self.attr.onItemSelect(rowdata);
            });
        },
        ATTRS: {
            "showTrigger": "click",//click|hover|input|search,分别为点击触发|鼠标hover触发|输入内容后触发|查询触发
            "hideTrigger": "clickout",//blur,esc,delay
            "position": "berth",//fixed,berth,fixed为公用模式,berth为独立模式
            "align": "bottom left",//top,bottom,left,right,center最多支持两两组合相对两方向除外,如bottom left表示下方显示左线对齐,left bottom 表示左方显示下线对齐
            "berth": null,
            "wrapper": "body",
            "width": "berth",
            "height": "auto",
            "content": null,
            "time": 0,//弹出框多久消失        
            "showArrow": false,
            "textField": "text",
            "enableCustom": false,//是否允许自定义,不允许时输入非查询内容时将被移除            
            "data": null,//可以为数组或者function,function自带两个参数obj(触发对象)和res(回调)
            "cache": true,//是否缓存数据,当为true时,当输入内容已有记录时将从缓存记录中寻找
            "cacheCount": 100,//最多缓存多少条数据
            "onItemClick": function (itemdata) {

            },
            "onItemSelect": function (itemdata) {

            },
            "moduleName": "search",
        },
        METHODS: {
            bindData: function (data) {
                var self = this;
                self.o_content.empty();
                $.each(data, function (i, v) {
                    self.addItem(v, i);
                });
            },
            addItem: function (rowdata, rowindex) {
                var self = this;
                var o_item = $("<div>", {
                    "class": "search-item",
                    "html": rowdata[self.attr.textField],
                    "title": rowdata[self.attr.textField]
                });
                o_item.attr("module-search-item", "");
                o_item.data("search-itemdata", rowdata);
                self.o_content.append(o_item);
            },
            searchData: function (keyword) {
                var self = this;
                var $list = self.o_content.find("[module-search-item]");
                for (var i = 0; i < $list.length; i++) {
                    var text = $list.eq(i).text();                  
                    if (text.indexOf(keyword) > -1) {
                        text = text.replace(keyword, '<span style="color:#ff6a00;font-weight:bolder;">' + keyword + '</span>');
                        $list.eq(i).prependTo(self.o_content);
                    }
                    $list.eq(i).html(text);
                }
                self.o_content.scrollTop(0);
            },
            //重新注册事件
            reginEvent: function () {
                var self=this;
                self.o_content.on("click", "[module-search-item]", function (e) {
                    var obj = $(this);
                    self.selectItem(obj);
                });

                this.__reginEvent();
            },
            //更改选择项
            changeSelect: function (num) {
                var self = this;
                var obj = self.getSelectItem();
                if (!obj) {
                    if (num == 1) {
                        self.selectItem(self.o_wrapper.find("[module-search-item]:first"), false);
                    }
                    else {
                        self.selectItem(self.o_wrapper.find("[module-search-item]:last"), false);
                    }
                    return;
                }
                var o_obj = $(obj);
                var tagobj;
                if (num == 1) {
                    tagobj = o_obj.next();
                }
                else {
                    tagobj = o_obj.prev();
                }
                if (tagobj.length > 0) {
                    o_obj.removeClass("selected");
                    self.selectItem(tagobj, false);
                    var _h = tagobj.get(0).offsetTop + tagobj.get(0).offsetHeight;
                    if (_h > self.o_wrapper.height()) {
                        self.o_wrapper.get(0).scrollTop = _h - self.o_wrapper.height();
                    }
                    if (tagobj.get(0).offsetTop < self.o_wrapper.get(0).scrollTop) {
                        self.o_wrapper.get(0).scrollTop = tagobj.get(0).offsetTop;
                    }
                }
            },
            getSelectItem: function () {
                var self = this;
                if (self.o_wrapper.find("[module-search-item]").length == 0) {
                    return null;
                }
                //获取已选择项
                var obj = self.o_wrapper.find("[module-search-item].selected");              
                return obj.get(0);
                //if (obj.length == 0) {
                //    return self.o_wrapper.find(".search-item").get(0);
                //}
                //else {
                //    return obj.get(0);
                //}
            },
            selectItem: function (obj,isclick) {
                var self = this;
                var rowdata = obj.data("search-itemdata");
                obj.addClass("selected");
                self.o_berth.val(rowdata[self.attr.textField]);
                self.isselect = true;
                if (isclick!==false) {
                    self.hide();
                    self.trigger("item.select", rowdata, obj);
                }
                else {
                    self.trigger("item.click", rowdata, obj);//后面考虑移到上面的判断力
                }
            }
        },
        __searchEvent:function () {
            var self = this;          
            //查询触发
            if (/search/.test(self.attr.showTrigger)) {
                $(self.attr.wrapper).on('keyup', self.attr.berth, function (e) {
                    if (e.keyCode == 13) {
                        //up
                        self._active = false;
                        self.hide();
                        return;
                    }
                    if (e.keyCode == 38) {
                        //up
                        self.changeSelect(-1);
                        return;
                    }
                    if (e.keyCode == 40) {
                        //down
                        self.changeSelect(1);
                        return;
                    }

                    var v = $(this).val();
                    self.inele = true;
                    self.e_berth = this;
                    self.o_berth = $(this);
                    self.show({                       
                        isreset: true
                    });
                    self.trigger('search', v);
                });

                $(self.attr.wrapper).on('focus', self.attr.berth, function () {
                    self._active = true;//表示激活状态.激活状态才能显示下拉框
                });

                $(self.attr.wrapper).on('blur', self.attr.berth, function () {
                    self._active = false;//表示激活状态
                });
            }         
            self.on("hide", function (e) {
                if (!self.attr.enableCustom && !self.isselect) {
                    self.o_berth.val('');
                }
            });
            //self.on("item.click", function (e, rowdata, obj) {
            //    self.o_berth.val(rowdata[self.attr.textField]);
            //});
        },
        __render: function (opt, res) {
            var self = this;            
            var _data = self.attr.data;
            if (typeof _data === 'function') {
                var k = opt.e_berth.value;
                var _result = self._dbdata.query(k);
                if (_result) {
                    self.bindData(_result);
                    res();
                }
                else {
                    var uuid = self._uuid = self.fn.uuid();
                    _data(k, opt.e_berth, function (result) {
                        self._dbdata.insert(k, result);
                        if (uuid == self._uuid) {
                            self.bindData(result);
                            res();
                        }
                    });
                }              
            }
            else {
                self.bindData(_data);
                res();
            }          
        }, 
        __getRowHtml: function (row) {           
            return _html;
        },
        __afterCreateWrapper:function(){
            this.o_wrapper.addClass("module-search");
        }
    });

    return Search;
});