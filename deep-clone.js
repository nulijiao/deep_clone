var byj = (function(){
    var Byj = {};
    Byj.map = function(arr, fn) {
        var newArr;
        arr = Array.prototype.slice.call(arr);
        if (Object.prototype.toString.call(arr).toLowerCase() !== '[object array]'){
            return 'not a array'
        }
        newArr = [];
        for (var i = 0; i < arr.length; i++) {
            newArr.push(fn(arr[i], i));
        }
        return newArr;
    }
    Byj.reduce = function(fn, initial) {
        initial = arr[0];

    }
    Byj.forEach = function(arr, fn) {
        for(var i = 0; i < arr.length; i++) {
            fn(arr[i], index);
        }
    }
    Byj.getCurry = function(){

    }
    // 合并两个有序的数组
    Byj.getorderArray = function(arr1, arr2) {
        var c = [];
        var i = 0, j = 0, length1 = arr1.length, length2 = arr2.length;
        while(i < length1 || j < length2) {
            if(arr1[i] >= arr2[j] || (arr2[j] && !arr1[i])) {
                c.push(arr2[j]);
                j++;
            } 
            if (arr1[i] < arr2[j] || (arr1[i] && !arr2[j])) {
                c.push(arr1[i]);
                i++;
            }
        }
    }
    // 发现把promise最外层的res放在外面就会有一个问题无法打开最外面的promise原因是啥？
    Byj.PromiseAll = function(promises) {
        var result = [], length = promises.length;
        return new Promise(function(res, rej){
            for(var i = 0; i < length; i++) {
                Promise.resolve(promises[i]).then(function(val){
                    result.push(val);
                    if (result.length === length) {
                        res(result);
                    }
                }).catch(function(val){
                    result.push(val);
                    if (result.length === length) {
                        res(result);
                    }
                });
                console.log(result);
                
            }
        })
    }
    // 动态监测某一个值Object.defineProperty中set其实是相当于一个重新赋值就会执行但是要对比之前的值是否是相同的否则无意义, 某个值发生变化以后是不是应该把整个值都传递过去还是传递变化的值
    function watchChange(val, fn, prop) {
        var store;
        var oldvalue = val[prop];
        var valType = Object.prototype.toString.call(val).toLowerCase();
        var setter = function(newVal) {
            console.log('oldvalue', oldvalue, '新的value', newVal);
            if (oldvalue !== newVal) {
                fn(oldvalue, newVal, prop)
            }
            oldvalue = newVal;
        }
        if (valType === '[object object]') {
            store = Object.create(valType);
            var ObjeProps = Object.keys(valType);
            for (var i = 0; i < ObjeProps.length; i++) {
                Object.defineProperty(valType, ObjeProps[i], {
                    set: setter
                });
            }
        }
        if (valType === '[object array]') {
            methodNames.forEach(function(item) {
                watchArrayProps(valType, item);
            })
        }
        if (valType === '[object function]') {

        }

    }
    function watchArrayProps(arr, method) {
        var oldarr = arr.slice();
        Object.defineProperty(arr, method, {
           value: function(){
               
           }
        })
    }
    var methodNames = ["pop", "push", "reverse", "shift", "sort", "slice", "unshift", "splice"];
    //  测试结果表明
    function uu(promises) {
        var result = [], length = promises.length;
        return new Promise(function (res, rej) {
            for (var i = 0; i < length; i++) {
                Promise.resolve(promises[i]).then(function (val) {
                    result.push(val);
                    if (result.length === length) {
                        res(result);
                    }
                }).catch(function (val) {
                    result.push(val);
                    if (result.length === length) {
                        res(result);
                    }
                });
                // 输出是一个空数组因为被push是一个异步的过程但是在执行for的时候同步会始终认为达不到长度所以就会有无法resolve所以要么动态监听result要么的话就把他放在then异步中判断，已经执行过的代码不会从都继续执行，异步带来的同步代码问题
                console.log(result);

            }
        })
    }
    Byj.compose = function (params) {
        var args = [].slice.call(arguments);
        var length = args.length;
        var next = args[args.length - 1];
        for(var i = length - 2; i > -1; i--) {
            next = next(args[i]);
        }
        return next;
    }
    Byj.indexOf = function(arr, target) {
        if (typeof target === 'string' && typeof arr === 'string') {
           return baoli(arr, target);
        }
        if (arr instanceof Array) {
            for(var i = 0; i < arr.length; i++) {
                if(arr[i] === target){
                    return i;
                }
            }
            return -1;
        }
    }
    // 时间复杂度太高所以考虑改成KMP算法
    function baoli(str, target) {
        var j = 0;
        var i = 0;
        while(i < str.length && j < target.length){
            if(str[i] === target[j]){
                j++;
            }else{
                j = 0;
            }
            i++;
        }
        if(j === target.length){
            console.log(i-j)
        }else{
            return -1;
        }
    }
    Byj.flattenObj = function(obj) {
        var target = {};
        getFtattenAttr(obj);
        return target
        function getFtattenAttr(obj){
            Object.keys(obj).map(function(item){
                var that = obj[item];
                if (Object.prototype.toString.call(that).toLowerCase() === '[object object]'){
                    getFtattenAttr(that)
                }else{
                    target[item] = that;
                }
            });
        }
    }
    // 判断是否是NaN window中的NaN会把字符串也作为NaN这是缺点所以NUMber.NaN进行了弥补
    Byj.isNaN = function(a) {
        return a !== a;
    }
    // -0 !== +0 
    Byj.isEqueal = function(a, b) {
        if (typeof a === 'number' && typeof b === 'number') return (1/a === 1/b);
        else return a === b;
    }
    // 等同于 object.create的polyfill
    Byj.extend = function(sup, sub) {
        var F = function(){};
        F.prototype = sup.prototype;
        sub.prototype = new F();
    }
    
    // fn.call
    // Function.prototype.call = (context, args)
    // contet.fn = this;
    // for
    // 
    // bind函数是可以支持new的所以我们的方法需要支持bind的new
    Byj.bind = function(fn, context, args) {
        var args = [].slice.call(arguments);
        args.splice(0, 2);
        var Super = function(){};
        var F = function() {
            var arr = [].slice.call(arguments).concat(args);
            if(this instanceof Super) {
                return fn.apply(this, arr)
            }else {
                return fn.apply(context, arr)
            }
        }
        F.prototype = new Super();
        return F;
    }
    Byj.getOrderPromisefunction = (promises) {
        if(typeof Promise !== 'function') {
            return '当前环境不支持promise'
        }
        var result = Promise.resolve();
        for(var i = 0; i < promises.length; i++) {
            result = result.then(promises[i]);
        }
        return result;
    }
    Byj.flattenArray = function(arr){
        var newArr = [];
        return arr.reduce(function(pre, next){
            // 如果没有上一个返回值reduce没办法传递过去
            return pre.concat(next)
        }, newArr)
    }
    Byj.flattenArray = function(arr) {
        var target = [];
        getFtattenAttr(obj);
        return target
        function getFtattenAttr(obj) {
            Object.keys(obj).map(function (item) {
                var that = obj[item];
                if (Object.prototype.toString.call(that).toLowerCase() === '[object array]') {
                    getFtattenAttr(that)
                } else {
                    target.push(that);
                }
            });
        }
    }
    Byj.deepClone=function(initialObj, finalObj) {
        return _deepClone(initialObj, finalObj, {
            initialObjs: [],
            finalObjs: []
        });
    }
    function _deepClone(initialObj, finalObj, conflict) {
        var i;
        if (initialObj && typeof initialObj === "object" && (i = [Object, Array].indexOf(initialObj.constructor)) != -1) {
            if (!finalObj) {
                finalObj = initialObj.constructor === Array ? [] : {};
            }
            if (conflict) {
                // 是不是在之前就有过引用当前的值
                i = conflict.initialObjs.indexOf(initialObj);
                if (i != -1) {
                    return conflict.finalObjs[i];
                }
                conflict.initialObjs.push(initialObj);
                conflict.finalObjs.push(finalObj);
            }
            for (var key in initialObj) {
                if (typeof initialObj[key] === 'function') {
                    var F = function () {
                        return initialObj[key]
                    }
                    var final = eval('F()');
                    finalObj[key] = final;
                }
                finalObj[key] = _deepClone(initialObj[key], finalObj[key], conflict);
            }
            return finalObj;
        }
        return initialObj;
    }

})();
module.exports = byj;