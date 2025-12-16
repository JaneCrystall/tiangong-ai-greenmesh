后端工程（Java 21 + Spring Boot 3 + DM8）
=========================================

当前状态
- Spring Boot 3.4.2 + Java 21，Gradle 构建；默认 profile 使用 H2 内存库可直接启动；`dm8` profile 预置达梦连接配置。
- 主要依赖：web/validation/actuator、data-jdbc、data-redis、spring-kafka、flyway（默认 dev 禁用）、H2（dev）。
- 简易探活接口：`GET /api/status` 返回应用名、profile、时间戳。

DM8 配置
- 配置文件：`src/main/resources/application.yml`，启用 `dm8` profile 即切换到达梦数据库。
- 环境变量（dm8 profile）：`DM8_HOST`、`DM8_PORT`、`DM8_DB`、`DM8_USER`、`DM8_PASSWORD`；Kafka/Redis 默认 `kafka:9092` / `redis:6379`。
- JDBC 驱动：需获取官方 DM8 JDBC 驱动并放入本地仓库或 `backend/libs`，再在 `build.gradle` 中添加 `runtimeOnly files('libs/DmJdbcDriver18.jar')`（已预留注释点）。

docker-compose（联调环境）
- 文件：`backend/docker-compose.yml`，包含 DM8、Kafka + Zookeeper、Redis、Flink（JM/TM）、Grafana。
- 默认口令放在 `.env`（不入库，`.gitignore` 已忽略），示例：
  ```
  DM8_SYSDBA_PWD=ChangeMeDm8!
  GRAFANA_USER=admin
  GRAFANA_PASSWORD=ChangeMeGrafana!
  ```
  启动：`docker compose up -d dm8 zookeeper kafka redis jobmanager taskmanager grafana`
- 访问：DM8 5236、Kafka 9092/29092、Redis 6379、Flink UI 8081、Grafana 3000。
- 运行后端指令时，可设置 `SPRING_PROFILES_ACTIVE=dm8` 并传入上述环境变量（不建议写死在源码）。

模块建议
- gateway: 接入、鉴权、流控、灰度、WebSocket/SSE。
- iam: OIDC/OAuth2、RBAC/ABAC、多租户。
- masterdata: 园区/站点/馈线/设备/计量点/因子库。
- telemetry: 采集标准化、数据质量校验、Kafka 生产、DM8 写入。
- carbon: 核算边界/因子/口径、碳账本/报表、可回放计算链路。
- dispatch: 策略/规则库，调度编排（校验→模拟→下发→回执），风险控制。
- settlement: 分时电价、计费、绿证匹配。
- audit: 审计事件、调度令牌、签名/哈希留痕。

构建与运行（示例命令）
- 开发（H2）：`./gradlew bootRun`（默认 profile=dev）
- 启动 dm8 profile：`SPRING_PROFILES_ACTIVE=dm8 DM8_HOST=localhost DM8_PORT=5236 DM8_USER=SYSDBA DM8_PASSWORD=<your_dm_pwd> ./gradlew bootRun`
- 测试：`./gradlew test`
- 数据库迁移：`./gradlew flywayMigrate`（需准备 dm8 驱动与库；Flyway 默认禁用，可结合达梦方言启用）
