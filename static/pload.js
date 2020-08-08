/*
 * @Description: 
 * @Author: bizhen.dong
 * @Date: 2020-08-08 12:31:45
 * @LastEditors: bizhen.dong
 * @LastEditTime: 2020-08-08 12:40:18
 */

// 计算缩放比例 
(function () {
    var phoneScale = parseInt(window.screen.width) / 750;
    document.write('<meta name="viewport" content="width=750, minimum-scale=' + phoneScale + ', maximum-scale=' +
        phoneScale + ', user-scalable=no">');
})();