(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.2.0/module', 'slide/0.1.0/slide', "css!helper/0.1.0/helper"], _module);
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("helper/0.1.0/helper", ['base/0.2.0/module', 'slide/0.1.0/slide', "helper/0.1.0/helper.css"], function (require, exports, module) {
            var Module = require('base/0.2.0/module');
            var Slide = require('slide/0.1.0/slide');
            return _module(Module, Slide);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (Module, Slide)  {
    /*
    * Demo
    * 
    */
    var Demo = Module.extend({
        initialize: function (options) {
            //init super
            Demo.superclass.initialize.apply(this, arguments);
            //init             
            Demo.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var modulename = $("#page_header").attr('module-name');
            var pageid = $("#page_header").attr('module-pageid');
            this.o_wrapper = $('<div class="module-helper" id="module_helper"></div>');
            $("body").append(this.o_wrapper);

            if (modulename) {
                this.o_dictionary = $('<span class="item color-orange" id="module_dictionary">典</span>');
                this.o_wrapper.append(this.o_dictionary);
                var slide = new Slide({
                    triggerEl: "#module_dictionary",
                    url: '/help/controls?modulename='+modulename,
                    quickClose: true
                });
            }
            if (pageid) {
                this.o_suggest = $('<span class="item color-blue" id="module_suggest">建</span>');
                this.o_wrapper.append(this.o_suggest);
                var slide = new Slide({
                    triggerEl: "#module_suggest",
                    url: '/help/looksuggest?pageid=' + pageid,
                    quickClose: false
                });
            }
        },
        ATTRS: {

        },
        METHODS: {
            render: function () {

            },
            openSuggest: function (pageid) {
                var self=this;
                if (!self._slide) {
                    self._slide = new Slide({
                        //triggerEl: "#module_suggest",
                        url: '/help/looksuggest?pageid=' + pageid,
                        quickClose: false
                    });
                }
                self._slide.show();
            }
        }
    });

    return Demo;
});