module.exports = {
    root: true,
    extends: "@react-native-community",
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        quotes: ["error", "double"],
        curly: "off",
        "react-native/no-inline-styles": "off",
    },
};
