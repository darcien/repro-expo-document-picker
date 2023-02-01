import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

function formatJson(value: any): string {
  return JSON.stringify(value, null, 2);
}

function formatPickResult(result: DocumentPicker.DocumentResult): string {
  switch (result.type) {
    case "cancel": {
      return "canceled";
    }
    case "success": {
      return formatJson({
        name: result.name,
        size: result.size,
        mimeType: result.mimeType,
        type: result.type,
        first100Uri: result.uri.slice(0, 100),
        hasFile: result.file != null,
      });
    }
  }
}

const UPLOAD_URL = "http://localhost:9090/file";

export default function App() {
  const [pickResult, setPickResult] =
    useState<DocumentPicker.DocumentResult | null>(null);
  const [uploadResult, setUploadResult] = useState(null);

  return (
    <View style={styles.container}>
      <Text>Pick result:</Text>
      <Text>
        {pickResult ? formatPickResult(pickResult) : "no document picked yet"}
      </Text>
      <Pressable
        onPress={async () => {
          const result = await DocumentPicker.getDocumentAsync();
          setPickResult(result);
        }}
        style={styles.button}
      >
        <Text>Press me to select document</Text>
      </Pressable>

      <Text style={{ marginTop: 24 }}>Upload result:</Text>
      <Text>{uploadResult ? formatJson(uploadResult) : "no upload yet"}</Text>
      <Pressable
        onPress={async () => {
          if (pickResult.type === "cancel") {
            return;
          }
          try {
            if (Platform.OS === "web") {
              const result = await fetch(UPLOAD_URL, {
                method: "POST",
                body: pickResult.file,
              });
              const jsonResult = await result.json();
              setUploadResult(jsonResult);
            } else {
              const result = await FileSystem.uploadAsync(
                UPLOAD_URL,
                pickResult.uri,
                {
                  httpMethod: "POST",
                  uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                }
              );

              setUploadResult(result.body);
            }
          } catch (error) {
            console.log("Error uploading", { error });
          }
        }}
        style={styles.button}
      >
        <Text>Press me to upload selected document</Text>
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
  button: {
    marginTop: 24,
    backgroundColor: "salmon",
    padding: 8,
  },
});
