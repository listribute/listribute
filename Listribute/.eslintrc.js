module.exports = {
    root: true,
    extends: "@react-native",
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        quotes: ["error", "double"],
        curly: "off",
        "react-native/no-inline-styles": "off",
        "react/no-unstable-nested-components": [
            "warn",
            {
                allowAsProps: true,
            },
        ],
    },
};
