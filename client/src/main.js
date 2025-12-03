import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 一時的にコンソール出力を抑制する（開発時の大量ログを止めたい場合に便利）
// 解除したいときはこのブロックをコメントアウトしてください。
if (typeof console !== 'undefined') {
	['log', 'warn', 'error', 'info', 'debug'].forEach((m) => {
		try {
			console[m] = () => {};
		} catch (e) {}
	});
}

createApp(App).use(router).mount("#app");
