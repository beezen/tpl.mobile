const ts = require("typescript")
const fs = require("fs");
let open = require('open');
let path = require('path');
/**
 * 生成api文档
 */
exports.api = () => {
    var apiUrl = require(path.resolve(process.cwd(), "./package")).apiUrl;
    if (apiUrl) {
        require("http").get(apiUrl, res => {
            var api = '';
            req.on('data', function (data) {
                api += data;
            });
            req.on('end', function () {
                digo.writeFile("api.json", api);
                exports._api();
            });
        })
    } else {
        exports._api();
    }
};

exports._api = () => {
    digo.src(path.resolve(process.cwd(), "./api.json")).pipe((file) => {
            let d = JSON.parse(file.content);
            for (let k in d.types) {
                for (let f in d.types[k].fields) {
                    d.types[k].fields[f].optional = true;
                }
            }
            file.content = JSON.stringify(d);
        })
        .pipe("digo-api", {
            apiDir: "src/components/api/",
            docDir: "src/components/api/",
            mockDir: "mocks",
            mergeDir: "mocks",
            ajaxModule: "components/ajax"
        })
        .dest(".")
        .then(() => {
            exports.transformApiToJs();
            exports.openapi();
        });

};

exports.openapi = function () {
    open("src/components/api/index.html");
};
/** 表示一个 TypeScript 编译器 */
class TypeScriptCompiler {

    /**
     * 创建一个新的 TypeScript 编译器
     * @param compilerOptions 附加的编译选项
     * @param customTransformers 自定义语法转换器
     */
    constructor(compilerOptions = {}, customTransformers) {
        this.compilerOptions = compilerOptions = ts.fixupCompilerOptions(compilerOptions)
        compilerOptions.suppressOutputPathCheck = true
        compilerOptions.isolatedModules = true
        compilerOptions.allowNonTsExtensions = true
        compilerOptions.noLib = true
        compilerOptions.noResolve = true
        compilerOptions.lib = null
        compilerOptions.types = null
        compilerOptions.noEmit = null
        compilerOptions.noEmitOnError = null
        compilerOptions.paths = null
        compilerOptions.rootDirs = null
        compilerOptions.declaration = null
        compilerOptions.composite = null
        compilerOptions.declarationDir = null
        compilerOptions.out = null
        compilerOptions.outFile = null
        compilerOptions.outDir = null
        this.newLine = ts.getNewLineCharacter(compilerOptions)
        this.customTransformers = customTransformers
    }

    /**
     * 编译指定的文件并返回结果
     * @param name 要编译的文件名
     * @param source 要编译的文件内容
     */
    compile(name, source) {
        const sourceFile = ts.createSourceFile(name, source, this.compilerOptions.target)
        sourceFile.moduleName = name
        let text
        let sourceMap
        const program = ts.createProgram([name], this.compilerOptions, {
            getSourceFile(fileName) {
                return fileName === ts.normalizePath(name) ? sourceFile : undefined
            },
            writeFile: function (name, content) {
                if (ts.fileExtensionIs(name, ".map")) {
                    sourceMap = content
                } else {
                    text = content
                }
            },
            getDefaultLibFileName() {
                return "lib.d.ts"
            },
            useCaseSensitiveFileNames() {
                return false
            },
            getCanonicalFileName(fileName) {
                return fileName
            },
            getCurrentDirectory() {
                return ""
            },
            getNewLine: () => this.newLine,
            fileExists(fileName) {
                return fileName === name
            },
            readFile() {
                return ""
            },
            directoryExists() {
                return true
            },
            getDirectories() {
                return []
            }
        })
        program.emit(undefined, undefined, undefined, undefined, this.customTransformers)
        return {
            program: program,
            text: text,
            sourceMap: sourceMap
        }
    }

}

/**
 * 转译api的ts文件为js文件
 */
exports.transformApiToJs = () => {
    var t = new TypeScriptCompiler();

    function build(dir) {
        fs.readdirSync(path.resolve(process.cwd(), `${dir}`))
            .forEach(e => {
                if (path.parse(e).ext == '.ts') {
                    fs.writeFileSync(path.resolve(process.cwd(), `${dir}/${path.parse(e).name}.js`), t.compile("", fs.readFileSync(path.resolve(process.cwd(), `${dir}/${path.parse(e).name}.ts`)).toString()).text)
                }
                if (path.parse(e).ext == '') {
                    build(`${dir}/${e}`);
                }
            });
    }
    build('src/components/api'); // 转译对应地址
}