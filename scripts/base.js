let digo = require("digo");
/**
 * 合并分支到 master 并提交
 * @example digo p m '提交描述'
 */
exports.publish = () => {
    const mergeToMaster = (digo.parseArgs()[1] == 'm');
    const message = digo.parseArgs()[2] || digo.parseArgs()[1] || "优化";
    const branch = (/\/([^\/]*)$/.exec(digo.readFileIf(".git/HEAD").toString()) || ["", ""])[1].trim() || "master";
    const master = "master";
    if (mergeToMaster && master !== branch) {
        digo.info(`{bright:(0/3)上传 ${branch} 分支}`, {});
        digo.exec(`git add -A && git commit -m "${message}"`, {
            slient: true
        });
        digo.exec(`git pull origin ${branch}`, {
            slient: true
        });
        digo.exec(`git push origin ${branch}:${branch}`, {
            slient: true
        });
        digo.info(`{bright:(1/3)合并 ${branch} 分支到 ${master} 分支}`, {});
        digo.exec(`git checkout ${master}`, {
            slient: true
        });
        digo.exec(`git pull origin ${master}`, {
            slient: true
        });
        digo.exec(`git merge ${branch}`, {
            slient: true
        });
        digo.then(() => {
            digo.info(`{bright:(2/3)上传 ${master} 分支}`, {});
            digo.exec(`git add -A && git commit -m "${message}"`, {
                slient: true
            });
            digo.exec(`git push origin ${master}`, {
                slient: true
            });
            digo.exec(`git checkout ${branch}`, {
                slient: true
            });
            digo.exec("git reset --hard", {
                slient: true
            });
            digo.info("{bright:(3/3)提交完成}", {});
        });
    } else {
        digo.info(`{bright:(0/1)上传 ${master} 分支}`, {});
        digo.exec(`git add -A && git commit -m "${message}"`, {
            slient: true
        });
        digo.exec(`git pull`, {
            slient: true
        });
        digo.exec(`git push origin ${master}`, {
            slient: true
        });
        digo.info("{bright:(1/1)提交完成}", {});
    }
};

/**
 * 清理仓库 默认dist
 */
exports.clean = () => {
    const dir = digo.parseArgs()[1];
    digo.cleanDir(dir || 'dist');
}

/**
 * 清理历史记录（危险操作慎用）
 */
exports.delGitHistory = () => {
    const message = digo.parseArgs()[1];
    if (!message) {
        digo.error("请补充操作描述，如：digo delGitHistory '初始化仓库'");
        return;
    }
    digo.exec('git checkout --orphan latest_branch && git add -A && git commit -am "first commit" && git branch -D master && git branch -m master && git push -f origin master');
}

/**
 * 构建
 */
exports.deploy = () => {
    let env = digo.parseArgs()['env'].split(' - ')[1];
    switch (env) {
        case 'fat':
        case 'fat1':
        case 'fat2':
        case 'fat3':
        case 'fat4':
            digo.exec('npm run build:fat');
            return;
        case 'uat':
            digo.exec('npm run build:uat');
            return;
        case 'pre':
        case 'prd':
            digo.exec('npm run build:prd');
            return;
    }
};