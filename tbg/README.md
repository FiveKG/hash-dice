### 钱包 TBG 
* 钱包 TBG1 和 TBG2 相关的逻辑

### 启动
* 部署使用 pm2
* 配置文件在当前目录 `pm2.json`
* 启动文件 start.sh

### 功能变动统一写到 `release.md` 文件中
* 阶段更新都记入当前目录下的 `release.md`

### `src` 部分目录描述
* `src/build` 启动服务时加载该文件, 主要用作一些数据库初始化
* `src/doc` 目录存放了相关的区块链和数据库操作文档
* `src/sql` 创建数据库的的相关语句
* `src/common/constant` 目录放了所有用到的计算比例，用户，字段常量
* `src/job` 目录为主要的逻辑调用层

### 所有区块链监听均使用 `POST` 请求获取
* 使用 `eosjs` 模块有时获取不到
```
curl -XPOST http://45.251.109.187:8888/v1/history/get_actions -H "Content-Type: application/json" -d '
{ 
    "pos": 0,
    "offset": 9,
    "account_name": "tbgreceiver" 
}'
```