let base = require('./scripts/base');
let src = require('./scripts/src');
let doc = require('./scripts/doc');
let digo = require('digo');
let path = require('path');
var exports = module.exports = Object.assign({}, src, base, doc);

/**
 * 打包额外的文件
 */
exports.bundleExtraFiles = () =>{
    exports.copyStatic();
    exports.copyConfig();
}
/**
 * 打包静态资源
 */
exports.copyStatic = () => {
    digo.copyDir('static', 'dist');
}

/**
 * 打包配置文件
 */
exports.copyConfig = () => {
    digo.copyFile(path.resolve(process.cwd(), 'package.json'), path.resolve(process.cwd(), 'dist/package.json'));
}