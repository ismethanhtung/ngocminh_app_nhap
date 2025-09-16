// Utility để test UTF-8 encoding
export const testUtf8Encoding = () => {
    const testString = "NGUYỄN THỊ MỸ DUNG";

    console.log("=== UTF-8 Encoding Test ===");
    console.log("Original string:", testString);
    console.log("String length:", testString.length);
    console.log("String bytes:", new TextEncoder().encode(testString));
    console.log("Normalized string:", testString.normalize("NFC"));
    console.log(
        "Normalized bytes:",
        new TextEncoder().encode(testString.normalize("NFC"))
    );

    // Test JSON stringify
    const testObject = { name: testString };
    const jsonString = JSON.stringify(testObject);
    console.log("JSON string:", jsonString);
    console.log("JSON bytes:", new TextEncoder().encode(jsonString));

    return {
        original: testString,
        normalized: testString.normalize("NFC"),
        json: jsonString,
        bytes: new TextEncoder().encode(testString),
    };
};

// Test function để chạy trong console
window.testUtf8 = testUtf8Encoding;
