import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import theme from "../styles/theme";

// The sandbox shell: it exposes the `Plugin` API to plugin code and reports
// everything back to React Native through postMessage. The WebView itself
// stays invisible — its only job is to run the plugin in isolation.
const SANDBOX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
<script>
  var onLoadHandler = null;

  function send(message) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } catch (e) {
      // Bridge unavailable (plain browser) — nothing to report to.
    }
  }

  var Plugin = {
    onLoad: function (handler) {
      onLoadHandler = typeof handler === "function" ? handler : null;
    },
    showText: function (text) {
      send({ type: "showText", text: String(text) });
    },
    error: function (message) {
      send({ type: "error", message: String(message) });
    },
  };

  function __runPlugin(code) {
    try {
      (0, eval)(String(code));
      if (onLoadHandler) {
        onLoadHandler();
      }
      send({ type: "done" });
    } catch (e) {
      send({ type: "error", message: (e && e.message) || String(e) });
    }
  }

  window.Plugin = Plugin;
  window.__runPlugin = __runPlugin;
  window.onerror = function (message) {
    send({ type: "error", message: String(message) });
  };
</script>
</body>
</html>`;

export default function PluginRunner({ pluginCode }) {
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);
  const webviewRef = useRef(null);

  const handleMessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return; // Ignore anything that isn't a well-formed sandbox message.
    }

    if (message.type === "showText") {
      setLines((previous) => [...previous, message.text]);
    } else if (message.type === "error") {
      setError(message.message);
    }
  };

  const handleLoadEnd = () => {
    if (!pluginCode) {
      setError("No code bundled for this plugin");
      return;
    }
    // Sandbox shell is ready — now inject the plugin's own code and run it.
    webviewRef.current?.injectJavaScript(
      `__runPlugin(${JSON.stringify(pluginCode)}); true;`,
    );
  };

  // The WebView always stays mounted — it is what runs the plugin, and its
  // output only arrives through postMessage after it has loaded.
  return (
    <View>
      {error ? (
        <Text style={styles.error}>Plugin error: {error}</Text>
      ) : lines.length === 0 ? (
        <Text style={styles.muted}>Loading plugin...</Text>
      ) : null}

      {lines.map((line, index) => (
        <Text key={`${index}-${line}`} style={styles.output}>
          {line}
        </Text>
      ))}

      <WebView
        ref={webviewRef}
        source={{ html: SANDBOX_HTML }}
        originWhitelist={["*"]}
        javaScriptEnabled
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        style={styles.hidden} // invisible — output only comes via postMessage
      />
    </View>
  );
}

const styles = StyleSheet.create({
  output: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  muted: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  error: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
  },
  hidden: {
    // Not display:none / 0x0 — the view must be laid out to load and run.
    width: 1,
    height: 1,
    opacity: 0,
  },
});
