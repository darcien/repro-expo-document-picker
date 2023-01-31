import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function formatResult(result: DocumentPicker.DocumentResult): string {
  switch (result.type) {
    case "cancel": {
      return "canceled";
    }
    case "success": {
      return JSON.stringify(
        {
          name: result.name,
          size: result.size,
          mimeType: result.mimeType,
          type: result.type,
          first100Uri: result.uri.slice(0, 100),
          hasFile: result.file != null,
        },
        null,
        2
      );
    }
  }
}

export default function App() {
  const [lastResult, setLastResult] =
    useState<DocumentPicker.DocumentResult | null>(null);

  return (
    <View style={styles.container}>
      <Text>Last result:</Text>
      <Text>
        {lastResult ? formatResult(lastResult) : "no document picked yet"}
      </Text>
      <Pressable
        onPress={async () => {
          const result = await DocumentPicker.getDocumentAsync();
          setLastResult(result);
        }}
        style={styles.selectButton}
      >
        <Text>Press me to select document</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  selectButton: {
    marginTop: 24,
    backgroundColor: "salmon",
    padding: 8,
  },
});
