# vscode设置
显示空格和tab
1.打开文件->首选项->设置
2.搜索框输入renderControlCharacters,然后选中勾选框
3.搜索框输入renderWhitespace,然后选择all
4.打开setting.json,加上：
  "editor.detectIndentation": false,
  "editor.renderControlCharacters": true,
  "editor.insertSpaces": true // true空格,false制表符
# husky commitlint安装步骤 https://github.com/conventional-changelog/commitlint
1.npx husky-init && npm install
2.
For Mac: 
  npm install --save-dev @commitlint/{config-conventional,cli}
For Windows: 
  npm install --save-dev @commitlint/config-conventional @commitlint/cli
3.echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
4.npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
# commitlint 例: git commit -m "fix: xxx"
提交代码常用的4个
feat: 新特性、新功能
fix: 修改bug
perf: 优化相关，比如提升性能、体验
refactor: 代码重构
以下作为了解
build: 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
chore: 其他修改, 比如改变构建流程、或者增加依赖库、工具等
ci:  持续集成修改
docs:  文档修改
revert:  回滚到上一个版本
style: 代码格式修改, 注意不是 css 修改
test: 测试用例修改
## 组织架构
├── api                   # 接口
    ├── java              # java类型
        ├── compute       # 计算模块
        ├── store         # 存储模块
        ├── network       # 网络模块
        ├── public        # 公共接口
        ├── management    # 管理中心
        ├── monitor       # 运维监控中心
        ├── operation     # 运营中心
        └── ...           
    ├── python
        └── ...
├── assets
├── components            # 公共组件(只显示界面,数据尽量放在父视图处理)
    ├── fast-cron         # 命名规范: 多个单词,以横行相连
    └── ...
├── hooks                 # 列表条件查询(列表查询建议采用此方式)
├── i8n   
├── icons                 # 图标资源      
├── layout                
├── router
├── store
├── styles                # 公共样式
├── types                 # 公共属性(数据类型)
├── utils                 # 公共方法
    └── ...
├── views                 # 界面

# api
### 写接口的时候,先全局搜索下,有的话就不用写重复接口了。
防止私有云调python公有云调java导致接口混乱,所以先区分后端接口类型,如后续有go类型接口再创建。
接口按功能所处模块存放,例如云主机就放在compute.ts,同时云主机相关的接口统一放一起。
## 公共组件  公共组件全部用ideal(理想)前缀命名
ideal-detail-info        # 详情信息
ideal-ip-input           # ip输入框
ideal-price-footer       # 价格底部视图
ideal-region-select      # 区域选择
ideal-button-events      # 多个按钮点击
ideal-table-list         # 列表
ideal-table-operate      # 列表行数据操作
ideal-select-search      # 下拉选择搜索
ideal-status-icon        # 状态图标

## 公共方法
cache                     # 缓存
directive                 # 权限校验
constant                  # 常量
request                   # 请求
storage                   # localStorage、sessionStorage缓存
tabs                      # tabs页面关闭
theme                    
  └──handleThemeStyle       # 处理主题样式
  └──hexToRgb               # hex颜色转rgb颜色
  └──rgbToHex               # rgb颜色转Hex颜色
  └──getLightColor          # 变浅颜色值
  └──getDarkColor           # 变深颜色值
tool
  └──pathToCamel            # 把路径转换成驼峰命名
  └──isExternalLink         # 是否外链
  └──replaceLinkParam       # 替换外链参数
  └──convertSizeFormat      # 转换文件大小格式
  └──getIconList            # 获取svg图标(id)列表
  └──getDictLabel           # 获取字典Label
  └──getDictDataList        # 获取字典数据列表
  └──withInstall            # 全局组件安装
  └──showLoading            # 显示加载
  └──hideLoading            # 隐藏加载
validate                  # 正则校验
  └──isExternalLink         # 外链
  └──validateEmail          # 邮箱
  └──validatePassword       # 密码
  └──validateMobile         # 手机号
  
# 安装插件
1.Auto Close Tag
2.Auto Rename Tag
3.BEM Helper
4.Code Spell Checker
5.Color Highlight
6.CSS Peek
7.ESLint
8.Image preview
9.indent-rainbow
10.IntelliSense for CSS class names in HTML
11.IntelliSense for CSS class names in HTML
12.Path Intellisense
13.Prettier - Code formatter
14.Svg Preview
15.Vue Language Features (Volar)
16.SonarLint
  setting.json配置SonarLint
  "sonarlint.rules": {
    "typescript:S1440": {
      "level": "on"
    },
    "typescript:S4139": {
      "level": "on"
    },
    "typescript:S1535": {
      "level": "on"
    },
    "typescript:S131": {
      "level": "on"
    },
    "typescript:S1821": {
      "level": "on"
    },
    "typescript:S2138": {
      "level": "on"
    },
    "typescript:S3973": {
      "level": "on"
    },
    "typescript:S1105": {
      "level": "on"
    },
    "typescript:S3524": {
      "level": "on"
    },
    "typescript:S3003": {
      "level": "on"
    },
    "typescript:S121": {
      "level": "on"
    },
    "typescript:S3317": {
      "level": "on"
    },
    "typescript:S1116": {
      "level": "on"
    },
    "typescript:S113": {
      "level": "on"
    },
    "typescript:S1530": {
      "level": "on"
    },
    "typescript:S3801": {
      "level": "on"
    },
    "typescript:S1131": {
      "level": "on"
    },
    "typescript:S2966": {
      "level": "on"
    },
    "typescript:S3498": {
      "level": "on"
    },
    "typescript:S4798": {
      "level": "on"
    },
    "typescript:S2376": {
      "level": "on"
    },
    "typescript:S1441": {
      "level": "on"
    },
    "typescript:S1110": {
      "level": "on"
    },
    "typescript:S1154": {
      "level": "on"
    },
    "typescript:S3402": {
      "level": "on"
    },
    "typescript:S3786": {
      "level": "on"
    },
    "typescript:S1537": {
      "level": "on"
    },
    "typescript:S3353": {
      "level": "on"
    },
    "typescript:S117": {
      "level": "on"
    },
    "typescript:S1526": {
      "level": "on"
    },
    "typescript:S6598": {
      "level": "off"
    }
  }

