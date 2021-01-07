import { WechatResponse, WxRefundRequest, WxRefundResponse } from "../models/weixin.model";
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

  //===============================
  // 微信支付
  //===============================
  export function refundWxPay(data: WxRefundRequest) {
    return postApi<WxRefundResponse>('wechat/pay-refund', data);
  }

  export function generateTranslationId(type: string|number) {
    const startTime = new Date().toISOString().slice(0, 19).replace(/-|T|:/g, '');
    // refundId format: ref[type][yymmddhhmmss][dddddd]
    return `ref${type}${startTime}${Math.floor(Math.random() * 1000000)}`;
  }
