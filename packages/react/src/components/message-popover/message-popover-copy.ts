import type { MessageTone } from "../message-strip/message-strip";

export interface MessagePopoverCopy {
  emptyState: string;
  messagesLabel: string;
  messageCount: (count: number) => string;
  toneLabel: (tone: MessageTone | "neutral") => string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function getMessagePopoverCopy(locale: string): MessagePopoverCopy {
  if (isChineseLocale(locale)) {
    return {
      emptyState: "当前没有消息。",
      messagesLabel: "消息",
      messageCount: (count) => `${count} 条消息`,
      toneLabel: (tone) => {
        if (tone === "error") {
          return "错误";
        }

        if (tone === "warning") {
          return "警告";
        }

        if (tone === "success") {
          return "成功";
        }

        if (tone === "information") {
          return "信息";
        }

        return "其他";
      },
    };
  }

  return {
    emptyState: "No messages right now.",
    messagesLabel: "Messages",
    messageCount: (count) => `${count} message${count === 1 ? "" : "s"}`,
    toneLabel: (tone) => {
      if (tone === "error") {
        return "Errors";
      }

      if (tone === "warning") {
        return "Warnings";
      }

      if (tone === "success") {
        return "Success";
      }

      if (tone === "information") {
        return "Information";
      }

      return "Other";
    },
  };
}
