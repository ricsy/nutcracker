# nutcracker

通用脚本仓库

## 脚本

### release.js

自动化版本号更新、git 提交和标签创建

```bash
# 本地使用
npx github:ricsy/nutcracker/scripts/release.js <version>
```

**功能特性：**
- 如果存在 package.json 则更新版本号
- 只有在有变更时才创建 git 提交
- 推送标签到远程（触发 CI/CD release 工作流）
