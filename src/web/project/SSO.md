---
title: SSO-单点登录
shortTitle: SSO
icon: fab fa-markdown
date: 2024-08-07
order: 2
category:
  - SSO
tag:
  - SSO
---

``` ts
    /**
     * src/store/modules/user.ts
     * 使用SSO登录 
     */
    async loginBySSO(data) {
      try {
        const { t } = useI18n();
        const { createMessage } = useMessage();
        const { changeLocale } = useLocale();
        const {
          accessToken,
          refreshToken,
          userName,
          userId,
          userImg,
          staffCode,
          orgName,
          newTimeOffset,
          oldTimeOffset,
          languageCode,
        } = data;

        // 保存token refreshToken
        this.setToken(accessToken);
        this.setRefreshToken(refreshToken);
        this.setUserInfo({ userName, userId, userImg, staffCode, orgName });
        // 切换语言
        changeLocale(languageCode);

        if (newTimeOffset !== oldTimeOffset) {
          createMessage.warning(
            t('common.timeOffsetTips', [`${newTimeOffset > 0 ? 'UTC+' : 'UTC'}${newTimeOffset}`]),
            6
          );
        }
      } catch (error) {
        return null;
      }
    },
```