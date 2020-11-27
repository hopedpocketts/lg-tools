# npm发布白名单
在 `package.json` 中设置一个要发布的文件（夹）白名单
```json
"files": ["lib/**/*"]
```

# scripts 

- 编译ts文件并生成对应的声明文件
```json
"build": "tsc"
```

- 格式化文档
```json
"format": "prettier --write \"src/*.ts\""
```

- 校验代码是否规范
```json
"lint": "tslint -p tsconfig.json"
```

- 在打包和发布包之前以及本地 npm install （不带任何参数）时运行。
```json
"prepare": "npm run build"
```
- 在 prepare 之前运行，并且仅在 npm publish 运行，在这里，我们可以运行 npm run test & npm run lint 以确保我们不会发布错误的不规范的代码。（这里没有写test测试用例）
```json
"prepublishOnly": "npm run lint"
```

- 在发布新版本包之前运行，为了更加确保新版本包的代码规范，我们可以在此运行 npm run lint
```json
"preversion": "npm run lint"
```

- version：在发布新版本包之后运行。如果您的包有关联远程 Git 仓库，每次发布新版本时都会生成一个提交和一个新的版本标记，那么就可以在此添加规范代码的命令。又因为 version script 在  git commit 之前运行，所以还可以在此添加 git add。
```json
"version": "npm run format && git add -A src"
```

- postversion：在发布新版本包之后运行，在 git commit之后运行，所以非常适合推送。
```json
"postversion": "git push && git push --tags"
```
# 创建一个新版本
执行如下命令会创建一个新版本， preversion，version，postversion scripts 会被执行：创建一个新的 tag 并且推送到我们的远程仓库。
```shell
$ npm version patch
```
然后再发布一次即可更新至npm
```shell
$ npm publish
```


