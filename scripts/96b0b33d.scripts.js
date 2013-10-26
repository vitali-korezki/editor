"use strict";angular.module("bricksApp",["ngAnimate","ngRoute","ui.codemirror"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/editor.html",controller:"EditorCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/database",{templateUrl:"views/database.html",controller:"DatabaseCtrl"}).when("/start",{templateUrl:"views/start.html",controller:"StartCtrl"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl"}).otherwise({redirectTo:"/"})}]).run(["apps","$location",function(a,b){0===a.all().length&&b.path("/start")}]),angular.module("bricksApp").controller("AboutCtrl",function(){}),angular.module("bricksApp").controller("DatabaseCtrl",["$scope","$window","apps","Storage",function(a,b,c,d){a.showMenu={actions:!1},a.defaultColumns=[{name:"id"},{name:"created_at"},{name:"updated_at"}],a.app=c.current(),a.storage=new d(a.app.id),a.selectTable=function(b){a.currentTable=a.app.tables[b],a.currentIndex=b,a.currentTable&&(a.data=a.storage.getTable(a.currentTable.name))},a.app.tables&&a.selectTable(0),a.showModal={newTable:!1,newColumn:!1},a.newTable={},a.newColumn={},a.newRow={},a.appsService=c,a.$watch("appsService.current().id",function(){a.app=c.current(),a.storage=new d(a.app.id),a.app.tables?a.selectTable(0):a.app.tables=[]},!0),a.hasTables=function(){return a.app.tables&&a.app.tables.length>0},a.isDefaultColumn=function(b){var c=!1;return a.defaultColumns.forEach(function(a){a.name===b.name&&(c=!0)}),c},a.addTable=function(){var b=angular.element(document.newTableForm);if(b.controller("form").$valid){a.newTable.columns=angular.copy(a.defaultColumns);var d=a.app.tables.push(angular.copy(a.newTable))-1;c.update(a.app),a.selectTable(d),a.newTable={},a.showModal.newTable=!1}},a.deleteTable=function(){var d=b.confirm('Are you sure you want to delete the table "'+a.currentTable.name+'"?');d&&(a.app.tables.splice(a.currentIndex,1),c.update(a.app),a.selectTable(0)),a.showMenu.actions=!1},a.addColumn=function(){var b=angular.element(document.newColumnForm);b.controller("form").$valid&&(a.currentTable.columns.push(angular.copy(a.newColumn)),c.update(a.app),a.newColumn={},a.showModal.newColumn=!1)},a.deleteColumn=function(d,e){var f=b.confirm('Are you sure you want to delete the column "'+d.name+'"?');f&&(a.currentTable.columns.splice(e,1),c.update(a.app))},a.addRow=function(){a.storage.addRow(a.currentTable.name,a.newRow),a.data.push(a.newRow),a.showModal.newRow=!1},a.deleteRow=function(b,c){a.storage.removeRow(a.currentTable.name,b),a.data.splice(c,1)},a.emptyTable=function(){var c='Are you sure you want to delete all the rows in the table "'+a.currentTable.name+'"?';b.confirm(c)&&(a.storage.emptyTable(a.currentTable.name),a.data=[]),a.showMenu.actions=!1}}]),angular.module("bricksApp").controller("EditorCtrl",function(){}),angular.module("bricksApp").controller("NavbarCtrl",["$location","$route","$scope","apps",function(a,b,c,d){c.show="/start"!==a.path(),c.showAppsMenu=!1,c.showAppsModal=!1,c.app={},c.appsService=d,c.$watch("appsService.all()",function(){c.apps=d.all(),c.currentApp=d.current()},!0),c.location=a,c.$watch("location.path()",function(a,b){a!==b&&(c.show="/start"!==a)}),c.addApp=function(){var a=angular.element(document.newAppForm);a.controller("form").$valid&&(c.apps.push(c.app),d.add(c.app),d.current(c.app),c.currentApp=c.app,c.app={},c.showAppsModal=!1)},c.selectApp=function(a){d.current(a),c.currentApp=a,c.showAppsMenu=!1},c.toggleAppsMenu=function(){c.showAppsMenu=!c.showAppsMenu},c.toggleAppsModal=function(){c.showAppsModal=!c.showAppsModal,c.showAppsMenu=!1},c.hideAppsModal=function(){c.showAppsModal=!1}}]),angular.module("bricksApp").controller("SettingsCtrl",["$location","$scope","$window","apps",function(a,b,c,d){b.appsService=d,b.$watch("appsService.current()",function(a){b.app=a},!0),b.saveSettings=function(){var a=angular.element(document.settingsForm);a.controller("form").$valid&&d.update(b.app)},b.deleteApp=function(b){var e=c.confirm('Are you sure you want to delete the app "'+b.name+"\"? There's no going back.");e&&(d.remove(b.id),a.path("/"))}}]),angular.module("bricksApp").controller("StartCtrl",["$location","$scope","apps",function(a,b,c){c.all().length>0&&a.path("/").replace(),b.app={},b.addApp=function(){b.newAppForm.$valid&&(c.add(b.app),c.current(b.app),a.path("/").replace())}}]),angular.module("bricksApp").directive("activelink",["$location",function(a){return{restrict:"A",link:function(b,c,d){var e=d.activelink,f=c.find("a")[0].hash.substring(1);b.$location=a,b.$watch("$location.path()",function(a){f.length>1&&a.substr(0,f.length)===f||a.split("/")[1]===f.substr(1,f.length)||1===f.length&&1===a.length?c.addClass(e):c.removeClass(e)})}}}]),angular.module("bricksApp").directive("collapseButton",["$animate",function(a){return{replace:!0,restrict:"E",template:'<button class="collapse-button"></button>',link:function(b,c,d){var e=angular.element("body"),f="collapsed-"+d.position,g="collapse-button-parent "+d.position,h=c.parent().addClass(g),i=!0;c.bind("click",function(){i=!i,i?a.removeClass(h,"closed",function(){e.removeClass(f)}):a.addClass(h,"closed",function(){e.addClass(f)})})}}}]),angular.module("bricksApp").directive("componentOptions",["$compile","$timeout","components",function($compile,$timeout,components){return{replace:!0,require:"^editor",restrict:"E",scope:{},templateUrl:"views/component-options.html",link:function(scope,element,attrs,editorCtrl){var form=element.find("form"),allComponents=components.all();scope.component={},scope.options={},scope.update=function(){},scope.select=editorCtrl.selection,scope.change=function(){scope.update(),editorCtrl.updateTemplate()},scope.$on("selection",function(){scope.options={},scope.component={},form.empty(),allComponents.some(function(a){var b;return scope.selection=editorCtrl.selection(),b=scope.selection.is(a.selector),b&&(scope.component=a),b}),scope.component["admin-script"]&&eval(scope.component["admin-script"]),scope.component.admin&&form.append($compile(scope.component.admin)(scope)),$timeout(function(){scope.$apply()})})}}}]),angular.module("bricksApp").directive("bindings",["$timeout","apps",function(a,b){return{replace:!0,require:"^editor",restrict:"E",scope:{},templateUrl:"views/bindings.html",link:function(c,d,e,f){c.selection=null,c.tables=b.current().tables,c.bindings={};var g=function(){c.bindings={column:"",repeat:"no",table:""}},h=function(a){var b,d,e;d=a.attr("ng-model")||a.attr("ng-bind"),d=d?d.split("."):[],2===d.length&&(c.bindings.table||(e=c.tables.filter(function(a){return a.name===d[0]})[0],c.bindings.table=e?e.name:""),b=e.columns.filter(function(a){return a.name===d[1]})[0],c.bindings.column=b?b.name:"")},i=function(a){var b,d=a.attr("ng-repeat");d=d?d.split(" "):[],3===d.length&&(c.bindings.repeat="yes",c.bindings.table||(b=c.tables.filter(function(a){return a.name===d[0]})[0],c.bindings.table=b?b.name:""))};c.$watch("bindings.table",function(a){c.tables&&a&&c.tables.some(function(b){return b.name===a?(c.columns=b.columns,!0):void 0})}),c.$watch("bindings",function(a){if(c.selection&&c.bindings.tables){var b,d,e=c.selection.prop("nodeName"),g=["INPUT","TEXTAREA","SELECT"].indexOf(e)>-1;"yes"===a.repeat?a.table&&(d=a.table+" in data['"+a.table+"']",c.selection.attr("ng-repeat",d)):c.selection.removeAttr("ng-repeat"),a.table&&a.column?(b=g?"ng-model":"ng-bind",c.selection.attr(b,a.table+"."+a.column)):c.selection.removeAttr("ng-bind").removeAttr("ng-model"),f.updateTemplate()}},!0),c.$on("selection",function(){c.selection=f.selection(),g(),h(c.selection),i(c.selection),a(function(){c.$apply()})})}}}]),angular.module("bricksApp").directive("deviceSwitch",function(){return{restrict:"E",scope:{iframe:"@"},templateUrl:"views/device-switch.html",link:function(a){var b=angular.element(a.iframe);a.devices=["mobile","tablet","laptop","desktop","resize-full"],a.currentDevice="resize-full",a.$watch("currentDevice",function(a,c){b.removeClass("device-"+c).addClass("device-"+a)})}}}),angular.module("bricksApp").directive("draggable",function(){return function(a,b,c){b.on("dragstart",function(b){var d=a.$eval(c.html);b.originalEvent.dataTransfer.effectAllowed="move",b.originalEvent.dataTransfer.setData("text/plain",d)})}}),angular.module("bricksApp").directive("editor",["$timeout","components","apps",function(a,b,c){return{controller:["$scope","$element",function(a,b){var c,d,e=b.find("iframe"),f=function(){c&&c.removeClass("bricks-selected"),d||(d=e.contents().find("div[ng-view]")),a.currentPage.template=html_beautify(d.html())},g=function(b){b.is("html, body, [ng-view]")||(c&&c.removeClass("bricks-selected"),c=b.addClass("bricks-selected"),a.$broadcast("selection"))},h=function(b){return b?(c=b,a.$broadcast("selection"),void 0):c},i=function(){return a.currentPage};return{iframe:e,updateTemplate:f,selectElement:g,selection:h,page:i}}],link:function(d){d.components=b.all(),d.app=c.current(),d.newPage={template:""},d.savePageText="Save Page",d.codemirrorOptions={lineWrapping:!0,lineNumbers:!0,mode:{name:"xml",htmlMode:!0},theme:"base16-dark"},d.app.pages&&0!==d.app.pages.length||(d.app.pages=[{url:"/",template:""}]),d.currentPage=d.app.pages[0],d.currentPage.template=html_beautify(d.currentPage.template),d.addPage=function(){var a=angular.copy(d.newPage);d.app.pages.push(a),c.update(d.app),d.currentPage=a,d.newPage={template:""},d.showNewPageModal=!1},d.deletePage=function(a){d.app.pages.some(function(b,c){return a.url===b.url?(d.app.pages.splice(c,1),!0):void 0}),c.update(d.app),d.currentPage=d.app.pages[0]},d.savePage=function(){c.update(d.app),d.savePageText="Saving...",a(function(){d.savePageText="Save Page"},1e3)}}}}]),angular.module("bricksApp").directive("editorFrame",["$http",function(a){return{replace:!0,require:"^editor",restrict:"E",template:'<iframe src="about:blank" seamless></iframe>',link:function(b,c,d,e){var f,g,h,i,j=c,k=j.contents(),l=function(a){var b=angular.element(a.target);b.is("html, body, div[ng-view]")||(f=a.target.draggable,a.target.draggable=!0,b.on("dragstart",function(a){a.originalEvent.dataTransfer.effectAllowed="move",g=angular.element(a.target)}))},m=function(a){f||a.target.removeAttribute("draggable")},n=function(a,b){b=angular.element(b),b.is("html, body")&&(b=i),b.is("div[ng-view], :empty")?b.append(a):b.after(a)},o=function(a,b){var c;b=angular.element(b),angular.isElement(a)?c=a.parent():a=angular.element(a),n(a,b),c&&c.html(c.html().trim())},p=function(a){a.preventDefault(),a.originalEvent.dataTransfer.dropEffect="move",h=angular.element(a.target),h.addClass("bricks-dragover")},q=function(){h.removeClass("bricks-dragover")},r=function(a){var c;return a.stopPropagation(),g?(g[0].removeAttribute("draggable"),c=g,g=null):c=a.originalEvent.dataTransfer.getData("text/plain"),h.removeClass("bricks-dragover"),o(c,a.target),e.updateTemplate(),b.$apply(),!1},s=function(a){var b=angular.element(a.target);e.selectElement(b)};b.$watch(function(){return e.page().template},function(a){i&&a!==i.html()&&i.html(a)}),j.on("load",function(){i=k.find("div[ng-view]"),i.html(e.page().template),k.on("click",s),k.on("dragover",p),k.on("dragleave",q),k.on("drop",r),k.on("mouseover",l),k.on("mouseout",m)}),a.get("views/layout.html",{cache:!0}).success(function(a){k[0].open(),k[0].write(a),k[0].close()})}}}]),angular.module("bricksApp").directive("events",["$timeout","apps",function(a,b){return{replace:!0,require:"^editor",restrict:"E",scope:{},templateUrl:"views/events.html",link:function(c,d,e,f){c.selection=null,c.tables=b.current().tables,c.events={};var g=function(a,b){var d=a.attr("ng-"+b);d?(c.events.type=b,c.events.action=d.split("(")[0],c.events.action&&(c.events.object=d.split("'")[1])):c.events={}};c.$on("selection",function(){c.selection=f.selection(),g(c.selection,"click"),a(function(){c.$apply()})}),c.$watch("events",function(a){var b;c.selection&&(a.type&&a.action&&a.object&&(b=a.action+"('"+a.object+"')",c.selection.attr("ng-"+a.type,b)),f.updateTemplate())},!0)}}}]),angular.module("bricksApp").directive("modal",function(){return{replace:!0,restrict:"E",scope:{closeable:"&",close:"&",open:"&",submit:"&",title:"="},templateUrl:"views/modal.html",transclude:!0,link:function(a){a.closeable=a.closeable(),void 0===a.closeable&&(a.closeable=!0)}}}),angular.module("bricksApp").directive("overlay",function(){return{replace:!0,require:"^editor",restrict:"E",template:'<div class="overlay"><div class="overlay-highlight"></div><div class="overlay-select"><a href="" class="delete"><span class="glyphicon glyphicon-trash"></span></a></div>',link:function(a,b,c,d){var e,f=angular.element(c.iframe),g=b.find(".overlay-select"),h=b.find(".overlay-highlight"),i=b.find(".delete"),j=function(a,b){var c=f[0].offsetTop,d=f[0].offsetLeft,e=b.offset();a.css("display","block").css("width",b[0].clientWidth+"px").css("height",b[0].clientHeight+"px").css("top",c+e.top+"px").css("left",d+e.left+"px")},k=function(a){var b=angular.element(a.target);b.is("html, body, div[ng-view]")||j(h,b)},l=function(a){var b=angular.element(a.target);b.is("html, body, div[ng-view]")||(e=b,j(g,b),h.hide())};f.on("load",function(){var a=f.contents();a.on("mouseover",k),a.on("click",l)}),i.on("click",function(a){var b=e.parent();a.preventDefault(),e.remove(),b&&b.html(b.html().trim()),d.updateTemplate(),g.hide()}),a.$watch(function(){return e&&e.prop("outerHTML")},function(){e&&j(g,e)}),a.$watch(function(){return d.page()},function(){h.hide(),g.hide()})}}}),angular.module("bricksApp").directive("validationClass",function(){return{require:"ngModel",restrict:"A",scope:{form:"@"},link:function(a,b,c){var d=b.controller("form"),e=b.parent().parent();a.$watch(c.ngModel,function(){var a=b[0].name;d[a].$dirty&&(d[a].$invalid?e.removeClass("has-success").addClass("has-error"):e.removeClass("has-error").addClass("has-success"))})}}}),angular.module("bricksApp").service("apps",["$window",function(a){var b="bricks_apps",c="bricks_current",d=a.localStorage.getItem(b),e=a.localStorage.getItem(c);return d=d?JSON.parse(d):[],{all:function(){return angular.copy(d)},current:function(b){if(!b){var f;return e=a.localStorage.getItem(c),d.forEach(function(a){a.id===e&&(f=a)}),angular.copy(f?f:d[0])}e=b.id,a.localStorage.setItem(c,e)},add:function(c){c.id=uuid(),d.push(angular.copy(c)),a.localStorage.setItem(b,JSON.stringify(d))},update:function(c){d.forEach(function(e,f){e.id===c.id&&(d[f]=angular.copy(c),a.localStorage.setItem(b,JSON.stringify(d)))})},remove:function(c){d.forEach(function(e,f){e.id===c&&(d.splice(f,1),a.localStorage.setItem(b,JSON.stringify(d)))})}}}]),angular.module("bricksApp").service("components",["$http",function(a){var b=[];return a.get("views/components.html",{cache:!0}).success(function(a){jQuery(a).find("component").each(function(a,c){var d={};[].forEach.call(c.children,function(a){d[a.nodeName.toLowerCase()]=a.innerHTML.trim()}),b.push(d)})}),{all:function(){return b}}}]),angular.module("bricksApp").factory("Storage",["$window",function(a){var b=function(a){this.app=a,this.prefix="bricks_app_"+a+"_"};return b.prototype.getTable=function(b){var c=a.localStorage.getItem(this.prefix+b);return c?JSON.parse(c):[]},b.prototype.emptyTable=function(b){return a.localStorage.removeItem(this.prefix+b)},b.prototype.addRow=function(b,c){var d=this.getTable(b),e=this._date();c.id=uuid(),c.created_at=e,c.updated_at=e,d.push(c),a.localStorage.setItem(this.prefix+b,JSON.stringify(d))},b.prototype.removeRow=function(b,c){var d=this.getTable(b);d.forEach(function(a,b){a.id===c.id&&d.splice(b,1)}),a.localStorage.setItem(this.prefix+b,JSON.stringify(d))},b.prototype._date=function(){return(new Date).toISOString().split(".")[0].replace("T"," ")},b}]);