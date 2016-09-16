(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/base'], function (a) {
            return _module();
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("base/0.2.0/module", ['base/0.1.0/base'], function (require, exports, module) {
            return _module();
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function () {
    /*
    * intellisense search (模块基类)
    * Created by 李岩岩 on 2016/1/29.
    * attrs:o_pobj,o_wrapper,o_input,apiurl,itemNumber,dotTemplate,hasPanel
    * events:nodata,error,render
    * methods:render,getJsonp,hide  
    */

    /*
     * 模块基类
     */
    var Module = Base.extend({
        initialize: function (options) {
            //init super
            Module.superclass.initialize.apply(this, arguments);
            //this.init(config);
            Module.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var attr = self.attr = {};
            $.each(self.ATTRS, function (k, v) {
                attr[k] = v.value;
            });
        },
        ATTRS: {
          
        },
        EVENTS: {
        },
        DOCEVENT: {
        },
        METHODS: {
            fn: {
                uuid: function () {
                    var s = [];
                    var hexDigits = "0123456789abcdef";
                    for (var i = 0; i < 36; i++) {
                        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                    }
                    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 0
                    s[8] = s[13] = s[18] = s[23] = "-";
                    var uuid = s.join("");
                    return uuid;
                }
            }
        }
    });
    return Module;
});