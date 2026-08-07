# BK 商城（shopping）

基于 Spring Cloud Alibaba + Dubbo 3 的微服务电商平台，包含前端（Vue3）与后端（22 个微服务模块）。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + Vite 5 + Element Plus + Pinia |
| 微服务框架 | Spring Boot 3.5 + Spring Cloud Alibaba + **Dubbo 3.3** |
| 注册中心/配置中心 | **Nacos**（192.168.0.99:8848） |
| 数据库 | MySQL 8（库名 `baizhanshopping`，表前缀 `bz_`）+ MyBatis-Plus |
| 搜索引擎 | Elasticsearch 8.4（商品搜索/推荐） |
| 缓存 | Redis（购物车/秒杀/验证码） |
| 消息队列 | RocketMQ 5.3（订单超时检查等） |
| 向量库 | Qdrant（AI 客服 FAQ 检索） |
| 文件存储 | FastDFS（商品图片） |
| AI | 阿里云 DashScope（通义千问 qwen-max + text-embedding-v2） |

## 模块说明

### 前端
| 模块 | 端口 | 说明 |
|---|---|---|
| **bk-mall-web** | 3000 | 电商前台（Vue3+Vite）：首页/搜索/商品详情/购物车/订单/秒杀/AI客服/个人中心 |

### 接口层（customer_api，供前端调用的 HTTP 接口，Dubbo Consumer）

| 模块 | 端口 | 说明 |
|---|---|---|
| **user_customer_api** | 8003 | 用户接口：登录/注册/邮箱验证码 |
| **cart_customer_api** | 8005 | 购物车接口：列表/加购/改数量/删除 |
| **order_customer_api** | 8006 | 订单接口：下单/订单列表/收货地址/支付 |
| **search_customer_api** | 8004 | 搜索接口：商品搜索/自动补全/商品详情 |
| **seckill_customer_api** | 8007 | 秒杀接口：秒杀列表/详情/抢购/支付 |
| **custcare_customer_api** | 8010 | AI 客服接口 |
| **gg_customer_api** | 8008 | 分类/品牌/商品类型接口 |

### 业务服务层（service，Dubbo Provider）

| 模块 | 端口 | 说明 |
|---|---|---|
| **user_service** | 9006 | 用户服务：用户注册/登录逻辑、密码加密 |
| **cart_service** | 9009 | 购物车服务 |
| **order_service** | 9010 | 订单服务：下单、订单管理、超时检查（RocketMQ 延时消息） |
| **goods_service** | 9013 | 商品服务：商品 CRUD、商品详情（含品牌/分类/图片/规格） |
| **search_service** | 9008 | 搜索服务：ES 商品搜索、数据同步、查询面板 |
| **seckill_service** | 9005 | 秒杀服务：秒杀商品 Redis 管理、抢购、秒杀订单 |
| **gg_service** | 9004 | 广告/横幅分类服务 |
| **custcare_service** | 9015 | AI 客服服务：敏感词过滤、FAQ 向量检索、大模型对话 |
| **mail_service** | 9011 | 邮件服务：发送验证码邮件 |
| **message_service** | 9007 | 消息服务 |
| **file_service** | 8002 | 文件服务：FastDFS 图片上传 |
| **admin_service** | 9002 | 管理后台服务 |
| **pay_service** | 9012 | 支付服务 |
| **webhooks** | 8100 | Webhook 回调服务 |

### 管理端/公共
| 模块 | 端口 | 说明 |
|---|---|---|
| **manager-api** | 8001 | 管理后台接口 |
| **message_api** | - | 消息接口 |
| **common** | - | 公共模块：POJO 实体、Dubbo 接口定义、工具类 |

## 端口速查

- 前端：**3000**
- 接口层（customer_api）：8003 / 8004 / 8005 / 8006 / 8007 / 8008 / 8010
- 业务服务（service）：9002 / 9004 / 9005 / 9006 / 9007 / 9008 / 9009 / 9010 / 9011 / 9012 / 9013 / 9015 / 8002 / 8100
- 管理端：8001

## 外部依赖（虚拟机 Docker 192.168.0.99）

| 服务 | 地址 |
|---|---|
| Nacos（注册/配置中心） | 192.168.0.99:8848 |
| MySQL | 本机 3306（root/root） |
| Redis | 192.168.0.99:6379 |
| Elasticsearch | 192.168.0.99:9200 |
| RocketMQ | 192.168.0.99:9876 |
| Qdrant | 192.168.0.99:6333 |
| FastDFS | tracker 22122 / storage 23000 |

> 注意：各服务配置（数据源、Redis、ES、MQ、AI 密钥等）位于 **Nacos 配置中心**（namespace `ed9ea14a-fdbd-4a79-99ef-847f926b7daa`），不在代码仓库内。

## 启动方式

1. 启动外部依赖（Nacos/MySQL/Redis/ES/RocketMQ/Qdrant/FastDFS）
2. 在 IDEA 中按依赖顺序启动各 Spring Boot 启动类（common 为公共库，无需启动）
3. 前端：`cd bk-mall-web && npm install && npm run dev`
4. 浏览器访问 http://localhost:3000
