import { WechatResponse } from "../models/weixin.model";
import { getApi, patchApi, postApi } from "./core/api.service";

export function sendWechatMsg(openid: string, title: string, description: string, url: string, picUrl: string,
  doctorid: string, username: string) {
  return postApi<WechatResponse>('wechat/send-client-msg/' + openid, {
    article: {
      title: title,
      description: description,
      url: url,
      picurl: picUrl
    },
    doctorid, // 用于微信消息记录
    username, // 同上
  });
}
