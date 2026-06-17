/**
 * 通知模块 - Server 酱推送
 * 用户下单/确认/拒绝时，通过 Server 酱推送消息到 C 老大微信
 */

import { Order, PLANS } from "./orders";

// Server 酱 SendKey（从环境变量读取，不写进代码）
const SCT_SENDKEY = process.env.SCT_SENDKEY || "";

interface NotifyResult {
  success: boolean;
  message: string;
}

/**
 * 调用 Server 酱 API 发送消息
 */
async function sendSctMessage(title: string, body: string): Promise<NotifyResult> {
  if (!SCT_SENDKEY) {
    console.warn("[notify] SCT_SENDKEY 未配置，跳过推送");
    return { success: false, message: "SendKey 未配置" };
  }

  try {
    const res = await fetch(`https://sctapi.ftqq.com/${SCT_SENDKEY}.send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        desp: body,
      }),
    });

    const data = await res.json();
    if (data.code === 0) {
      console.log("[notify] 推送成功:", title);
      return { success: true, message: "推送成功" };
    } else {
      console.error("[notify] 推送失败:", data);
      return { success: false, message: data.message || "推送失败" };
    }
  } catch (err) {
    console.error("[notify] 推送异常:", err);
    return { success: false, message: "推送请求异常" };
  }
}

/**
 * 格式化时间为可读格式
 */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 新订单通知
 */
export async function notifyOrderCreated(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;
  const payLabel = order.paymentMethod === "wechat" ? "微信" : "支付宝";
  const phone = order.userPhone ? `\n📱 电话：${order.userPhone}` : "";
  const note = order.note ? `\n💬 备注：${order.note}` : "";

  const title = `🆕 新订单！${planName} ¥${order.amount}`;
  const body = [
    `### 🆕 亦须AI 新订单通知`,
    ``,
    `| 项目 | 内容 |`,
    `|---|---|`,
    `| 套餐 | ${planName} |`,
    `| 金额 | ¥${order.amount} |`,
    `| 支付 | ${payLabel} |`,
    `| 用户 | ${order.userName} |`,
    `| 时间 | ${formatTime(order.createdAt)} |`,
    phone ? `| 电话 | ${order.userPhone} |` : "",
    note ? `| 备注 | ${order.note} |` : "",
    ``,
    `> 订单号：${order.id}`,
    ``,
    `[👉 去后台确认支付](https://yixu-ai.online/admin)`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendSctMessage(title, body);
}

/**
 * 订单确认通知
 */
export async function notifyOrderConfirmed(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;

  const title = `✅ 已确认收款 ${planName} ¥${order.amount}`;
  const body = [
    `### ✅ 订单已确认`,
    ``,
    `- 用户：${order.userName}`,
    `- 套餐：${planName}`,
    `- 金额：¥${order.amount}`,
    `- 确认时间：${formatTime(order.paidAt || "")}`,
    `- 订单号：${order.id}`,
  ].join("\n");

  return sendSctMessage(title, body);
}

/**
 * 订单拒绝通知
 */
export async function notifyOrderRejected(order: Order): Promise<NotifyResult> {
  const planName = PLANS[order.plan].name;

  const title = `❌ 已拒绝订单 ${planName}`;
  const body = [
    `### ❌ 订单已拒绝`,
    ``,
    `- 用户：${order.userName}`,
    `- 套餐：${planName}`,
    `- 金额：¥${order.amount}`,
    `- 原因：${order.rejectReason || "无"}`,
    `- 订单号：${order.id}`,
  ].join("\n");

  return sendSctMessage(title, body);
}
