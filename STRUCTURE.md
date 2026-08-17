# 项目目录说明

> 本文件独立于 README.md，仅用于记录每个目录的用途，方便快速定位代码。

## 前端

| 目录 | 说明 |
|------|------|
| `bk-mall-web/` | 电商前台（Vue3 + Vite + Element Plus + Pinia）：首页/搜索/商品/购物车/订单/秒杀/AI客服/个人中心 |
| `bk-mall-admin/` | 管理后台前端（Vue3 + Vite）：管理员/品牌/商品/分类/规格/角色/权限/秒杀/敏感词管理 |

## 公共模块

| 目录 | 说明 |
|------|------|
| `common/` | 公共模块：POJO 实体类、Dubbo 服务接口定义、工具类（Md5/Random）、全局异常处理 |

## 管理端

| 目录 | 说明 |
|------|------|
| `manager-api/` | 管理后台 HTTP 接口（Spring Security 认证授权 + Dubbo Consumer） |
| `admin_service/` | 管理后台 Dubbo 服务：管理员/角色/权限 CRUD |
| `message_api/` | 消息接口（备用/旧版管理端接口） |

## 业务服务层（Dubbo Provider）

| 目录 | 端口 | 说明 |
|------|------|------|
| `goods_service/` | 9013 | 商品服务：商品/品牌/分类/规格 CRUD |
| `order_service/` | 9010 | 订单服务：下单、订单管理、超时检查（RocketMQ 延时消息） |
| `cart_service/` | 9009 | 购物车服务：Redis + RocketMQ 同步 |
| `gg_service/` | 9004 | 广告/横幅分类服务 |
| `seckill_service/` | 9005 | 秒杀服务：Redis 库存管理、抢购、秒杀订单 |
| `search_service/` | 9008 | 搜索服务：Elasticsearch 商品搜索与数据同步 |
| `file_service/` | 8002 | 文件服务：图片上传 |
| `custcare_service/` | 9015 | AI 客服服务：敏感词过滤、FAQ 检索、大模型对话 |
| `mail_service/` | 9011 | 邮件服务：验证码邮件发送 |
| `message_service/` | 9007 | 消息服务 |
| `user_service/` | 9006 | 用户服务：注册/登录、密码加密 |

## 接口层（customer_api，HTTP + Dubbo Consumer）

| 目录 | 端口 | 说明 |
|------|------|------|
| `user_customer_api/` | 8003 | 用户接口：登录/注册/邮箱验证码 |
| `gg_customer_api/` | 8008 | 分类/品牌/商品类型接口 |
| `cart_customer_api/` | 8005 | 购物车接口（配置就绪，代码待开发） |
| `order_customer_api/` | 8006 | 订单接口（配置就绪，代码待开发） |
| `custcare_customer_api/` | 8010 | AI 客服接口（配置就绪，代码待开发） |

## 其他

| 目录 | 说明 |
|------|------|
| `screenshots/` | README 截图（首页 Banner、首页顶部） |
