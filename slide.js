(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.2.0/module', 'css!slide/0.1.0/slide'], function (Module) {
            return _module(Module);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("base/0.1.0/demo", ['base/0.2.0/module'], function (require, exports, module) {
            var Module = require('base/0.2.0/module');
            return _module(Module);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (Module) {
    /*
    * Demo
    * 
    */
    var Slide = Module.extend({
        initialize: function (options) {
            //init super
            Slide.superclass.initialize.apply(this, arguments);
            //init             
            Slide.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            this.__createWrapper();
            this.__initEvent();
        },
        ATTRS: {
            triggerEl: "",
            html: '',
            type: 'iframe',
            url: '',
            width:'500px',
            "_iframeHtml": '<iframe class="module-slide-iframe" data-slide-iframe></iframe>',
            "beforeShow": function (el,res) {
                res();
            },
            "quickClose": false//快捷关闭
        },
        METHODS: {            
            //render: function () {

            //}
            show: function (conf, isreset) {
                var self = this;
                if (isreset === undefined) {
                    isreset = true;
                }

                var _conf = $.extend({}, self.attr, conf);

                if (isreset) {
                    //self.__createWrapper();
                    this.__render(_conf, function () {
                        self.__show(_conf, isreset);
                    });
                }
                else {
                    this.__show(_conf, isreset);
                }
            },
            hide: function (backdata) {
                this.__hide(backdata);
            }
        },
        __createWrapper: function () {
            var self = this;
            //主面板
            self.o_wrapper = $('<div/>', {
                "class": "module-slide",
                "html": self.attr.html,
                "style":"width:"+self.attr.width+';'
            });
            self.o_wrapper.appendTo('body');
            self.o_content = self.o_wrapper;
            //self.o_content = self.o_wrapper.find('[data-popup-content]');
            //self.o_panel = self.o_wrapper.find('[data-popup-panel]');
            //self.o_title = self.o_wrapper.find('[data-popup-title]');          
            return self.o_wrapper;
        },
        __initEvent: function () {
            var self = this;
            if (self.attr.triggerEl) {
                $(document).on('click', self.attr.triggerEl, function (event) {
                    if (self.attr.beforeShow) {
                        var el;
                        if ($(self.attr.triggerEl).has(event.target).length > 0) {
                            el = $(event.target).parents(self.attr.triggerEl).first();
                        }
                        else {
                            el = $(event.target);
                        }

                        self.attr.beforeShow(el, function (conf) {
                            self.show(conf);
                        });
                    }
                    else {
                        self.show();
                    }
                });
            }

            self.on('show', function () {
                if (self.attr.quickClose) {
                    self._ondocclick = function (e) {
                        if (self.o_wrapper.has(e.target).length > 0) {
                            return;
                        }
                        var _els = $(self.attr.triggerEl);
                        if (_els.has(e.target).length > 0) {
                            return;
                        }

                        var _isok = true;
                        $.each(_els, function () {
                            if (e.target == this) {
                                _isok = false;
                                return;
                            }
                        })
                        if (!_isok) {
                            return;
                        }
                        //if ($(e.target).has(self.attr.triggerEl).length > 0) {
                        //    return;
                        //}
                        self.__docClick.call(self, arguments.callee);
                    };
                    $(document).bind('click', self._ondocclick);
                    self.__stopPropagation();
                }             
            })
        },
        __docClick: function (obj) {            
            this.hide();
            $(document).unbind('click', obj);
        },
        __stopPropagation: function (e) {
            var e = this.__getEvent();
            if (window.event) {
                //e.returnValue=false;//阻止自身行为
                e.cancelBubble = true;//阻止冒泡
            } else if (e && e.preventDefault) {
                //e.preventDefault();//阻止自身行为
                e.stopPropagation();//阻止冒泡
            }
        },
        //得到事件
        __getEvent: function () {
            if (window.event) {
                return window.event;
            }
            var func = this.__getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent
                       || arg0.constructor == KeyboardEvent)
                       || (typeof (arg0) == "object" && arg0.preventDefault
                       && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        __show: function (conf, isreset) {
            var self = this;
            if (!this.o_wrapper) {
                this.__createWrapper();
                return this.show(conf, isreset);              
            }
            if (isreset) {
                self.o_wrapper.addClass('open');
                if (conf.onHide) {
                    self.onceOnhide = conf.onHide;
                }
            }
            else {
                this.o_wrapper.addClass('open');               
            }
            this.trigger('show');
        },
        __hide: function (backdata) {
            var self = this;
            this.o_wrapper.removeClass('open');
            if (this._ondocclick) {
                $(document).unbind('click', this._ondocclick);
            }
            //等待动画延时隐藏
            setTimeout(function () {              
                if (self.onceOnhide) {
                    self.onceOnhide(backdata);
                    self.onceOnhide = null;
                }
                else {
                    if (self.attr.onHide)
                        self.attr.onHide(backdata);
                }
            }, 150);
            self.trigger("hide");
        },
        __render: function (conf, res) {
            var self = this;
            //if (conf.title) {
            //    self.o_title.html(conf.title);
            //    self.o_title.show();
            //    self.o_wrapper.find(".module-popup-icon").show();
            //}
            //else {
            //    self.o_title.hide();
            //    self.o_wrapper.find(".module-popup-icon").hide();
            //}            
            if (conf.type == "iframe") {
                self.o_content.html(conf._iframeHtml);
                var o_iframe = self.o_iframe = self.o_content.find("[data-slide-iframe]");
                //if (!conf.autoSize) {
                //    self.reSize(conf);
                //}
                o_iframe[0].onload = function () {
                    self.__iframe = this;
                    self.__iframe.contentWindow._slide = self;
                    //if (conf.autoSize) {
                    //    self.reSize(conf);
                    //}                  
                    self.trigger("render");
                };
                o_iframe.attr("src", conf.url);
                res();
            }
            else {
                //this.__getContent(conf,function (_content) {
                //    if (_content == undefined || _content == null || _content == "") {
                //        self.o_content.html("");
                //    }
                //    else {
                //        self.o_content.html(_content);
                //    }
                //    res();
                //});
            }          
        },
    });

    return Slide;
});