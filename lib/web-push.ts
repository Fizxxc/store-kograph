import webpush from "web-push";

let configured = false;

export function getWebPush() {
  if (!configured) {
    webpush.setVapidDetails(
      process.env.WEB_PUSH_SUBJECT || "mailto:admin@kographstudio.id",
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || "",
      process.env.WEB_PUSH_PRIVATE_KEY || ""
    );
    configured = true;
  }

  return webpush;
}
