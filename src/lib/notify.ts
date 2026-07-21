/**
 * 通知模块
 *
 * 主通道：企业微信群机器人 webhook（env: WECHAT_WEBHOOK_URL）
 * 回退通道：Server 酱（env: SCT_SENDKEY）
 *
 * 任一通道可用即推送成功；两者皆未配置则仅打印日志，不影响主流程。
 * 导出函数签名保持不变：notifyOrderCreated / notifyOrderConfirmed / notifyOrderRejected
 */

import { Order, PLANS } from "./orders";

// 企业微信 webhook（完整 URL，含 key）
const WECHAT_WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL || "";
// Server 酱 SendKey
const SCT_SENDKEY = process.env.SCT_SENDKEY || "";

interface NotifyResult {
  success: boolean;
  message: string;
}

/**
 * 统一发送入口：先企微，失败/未配置则 Server 酱
 */
async function sendNotify(title: string, body: string): Promise<NotifyResult> {
  // 1) 企业微信 webhook（markdown）
  if (WECHAT_WEBHOOK_URL) {
    try {
      const res = await fetch(WECHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msgtype: "markdown",
          markdown: { content: `## ${title}\n${body}` },
        }),
      });
      const data = await res.json();
      if (data.errcode === 0) {
        console.log("[notify] 企微推送成功:", title);
        return { success: true, message: "企微推送成功" };
      }
      console.warn("[notify] 企微推送返回错误:", data);
    } catch (err) {
      console.error("[notify] 企微推送异常:", err);
    }
  }

  // 2) 回退 Server 酱
  if (SCT_SENDKEY) {
    try {
      const res = await fetch(`https://sctapi.ftqq.com/${SCT_SENDKEY}.send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desp: body }),
      });
      const data = await res.json();
      if (data.code === 0) {
        console.log("[notify] Server酱推送成功:", title);
        return { success: true, message: "Server酱推送成功" };
      }
      console.error("[notify] Server酱推送失败:", data);
      return { success: false, message: data.message || "Server酱推送失败" };
    } catch (err) {
      console.error("[notify] Server酱推送异常:", err);
      return { success: false, message: "Server酱推送请求异常" };
    }
  }

  console.warn("[notify] 未配置任何通知通道（WECHAT_WEBHOOK_URL / SCT_SENDKEY），跳过推送:", title);
  return { success: false, message: "未配置通知通道" };
}

/** 格式化时间 */
function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 新订单通知 */
export async function notifyOrderCreated(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;
  const payLabel = order.paymentMethod === "wechat" ? "微信" : "支付宝";
  const phone = order.userPhone ? `\n> 电话：<font color="info">${order.userPhone}</font>` : "";
  const note = order.note ? `\n> 备注：${order.note}` : "";
  const cur = order.currency === "HKD" ? " (HKD)" : "";

  const title = `🆕 新订单！${planName} ¥${order.amount}`;
  const body = [
    `> 套餐：**${planName}**`,
    `> 金额：<font color="warning">¥${order.amount}${cur}</font>`,
    `> 支付：${payLabel}`,
    `> 用户：${order.userName}`,
    `> 时间：${formatTime(order.createdAt)}`,
    phone,
    note,
    `> 订单号：\`${order.id}\``,
    `\n[👉 去后台确认支付](https://yixu-ai.online/admin)`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendNotify(title, body);
}

/** 订单确认通知 */
export async function notifyOrderConfirmed(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;
  const title = `✅ 已确认收款 ${planName} ¥${order.amount}`;
  const body = [
    `> 用户：${order.userName}`,
    `> 套餐：${planName}`,
    `> 金额：<font color="warning">¥${order.amount}</font>`,
    `> 确认时间：${formatTime(order.paidAt || "")}`,
    `> 订单号：\`${order.id}\``,
  ].join("\n");

  return sendNotify(title, body);
}

/** 订单拒绝通知 */
export async function notifyOrderRejected(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;
  const title = `❌ 已拒绝订单 ${planName}`;
  const body = [
    `> 用户：${order.userName}`,
    `> 套餐：${planName}`,
    `> 金额：¥${order.amount}`,
    `> 原因：${order.rejectReason || "无"}`,
    `> 订单号：\`${order.id}\``,
  ].join("\n");

  return sendNotify(title, body);
}
