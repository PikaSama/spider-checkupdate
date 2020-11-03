# spider-checkupdate
![Author](https://img.shields.io/static/v1?label=Author&message=Zorin&color=9cf&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/PikaSama/spider-checkupdate?color=success&style=for-the-badge)
![Platform](https://img.shields.io/static/v1?label=Platform&message=Linux&color=orange&style=for-the-badge)

![GitHub top language](https://img.shields.io/github/languages/top/pikasama/spider-checkupdate?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/PikaSama/spider-checkupdate?color=ff69b4&style=for-the-badge)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/PikaSama/spider-checkupdate?color=%23007ec6&include_prereleases&style=for-the-badge)

一个自己写的nodejs爬虫练习，用于爬取idea全家桶激活码和github520项目，获取更新的日期并进行比对，如不一致则进行更新

本人代码不精，建议查看源码的时候可以拿碗饭一边吃一边看

如果你有更好的实现方法，欢迎 PR/Issues/...
## 如何使用
项目依赖于：

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/PikaSama/spider-checkupdate/axios?style=flat-square)

用于抓取页面和下载文件
   
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/PikaSama/spider-checkupdate/cheerio?style=flat-square)

用于解析页面
   
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/PikaSama/spider-checkupdate/node-stream-zip?style=flat-square)

用于解压文件
   
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/PikaSama/spider-checkupdate/inquirer?style=flat-square)

用于选项菜单
   
![Node version](https://img.shields.io/static/v1?label=node&message=>=12&color=success&style=flat-square)

项目基于Nodejs v12.19.0开发
   
本项目仅在Linux平台运行并测试过，因个人时间和精力有限，未在Windows平台进行测试，如果你尝试以Windows平台运行，可能会造成问题（如果真有问题还请发至Issues）

### 安装
使用npm
```bash
npm install
```
使用yarn
```
yarn
```

### 运行
```bash
node main.js
```

如果hosts文件更新后未生效，请手动执行
```bash
sudo systemctl restart NetworkManager
```
### 文件信息
 - main.js
   - 选项菜单
 - updatesChecker.js
   - 爬虫获取更新
 - settings.js
   - 设置菜单
 - reset.js
   - 清空数据（除hosts文件备份），恢复系统hosts文件
   
## 预览
检测更新

![checkupdate.gif](https://i.loli.net/2020/10/07/CIlLnAkGST1QD3J.gif)

设置

![cleardata.gif](https://i.loli.net/2020/10/07/jx2g1rhv3pQGKqF.gif)

## 注意
由于涉及到系统hosts文件的写入操作，如果需要自动替换hosts文件，请以超级用户的权限执行，但这可能会造成无法预料的问题，请慎重使用

同样因为会有以超级用户的权限执行，导致写入的文件普通用户无法读取

我不知道这是什么原因，在nodejs文档上已说明写入文件的权限默认是八进制文件权限`0o666`（所有人可读写），但经测试写入后的权限为`0o644`（宿主可读写，组内和其他人只读）

所以在每次写入文件时都会进行`chmod`修改文件权限，目录的文件权限为`777`，文件的权限为`666`

## FAQ
Q1：获取github520页面太慢了怎么办？

A1：爬虫默认采用`github.com.cnpmjs.org`作为镜像源，如果访问过慢可以换为`hub.fastgit.org`镜像源

如果你已经替换了github520的hosts文件，推荐直接改为`github.com`源站

怎么改？打开`updatesChecker.js`，搜索`axios.get`方法，在第二个结果修改就行

Q2: 怎么每次checkupdates都要进行设置？

A2：看见`Settings`这个选项了吗？回车进去设置就行，之后的checkupdates就会遵循设置进行了

如果要重新设置，方法也一样的

Q3：误删文件咋办？

A3：
1. 如果是resources目录下的文件，要么执行`Clear Data`操作再执行`checkupdates`重新下载文件，要么改`data.json`里两个键的值再执行`checkupdates`重新下载文件，要么cv`updatesChecker.js`里下载指定文件（包括写入和`chmod`）的代码并执行

2. 如果是`data.json`，执行`checkupdates`重新下载并生成文件

3. 如果是`settings.json`，执行`Settings`重新生成设置文件

4. 如果是系统Hosts文件的备份`hosts.bak`，自求多福吧。（其他没删到偏偏删这个，不愧是你）

Q4：我不小心设置某个选项为否，重新checkupdates因为文件是最新的导致用不那个功能了，怎么用回那个功能？
A4：同上，改`data.json`的两个键值，就能获取到更新了

Q5：提示`operation not permitted`怎么办？

A5：
1. 以超级用户权限执行（不推荐）

2. 只以超级用户权限执行一次`Change data owner and group`更改数据宿主和群组，然后重新执行你的操作（较为推荐）

造成这样的原因：以超级用户权限chmod文件后，普通用户再chmod这个文件是不行的，只能更改文件所有者和群组或继续用超级用户权限执行才可以（后续会进行改进）
## bug
暂无

## 更新日志
2020.10.30-18:53 v1.1.1 移除node-fetch依赖，使用axios下载文件

2020.10.7-12:47 v1.1.0 增加修改文件宿主和群组功能

2020.10.7-00:23 v1.0.0 发布初始版本
## 协议
[GPL-v3](http://www.gnu.org/licenses/gpl-3.0.en.html)
