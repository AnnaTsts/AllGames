export const fontFamily = {
  regular: "NunitoSans-Regular",
  semibold: "NunitoSans-SemiBold",
  bold: "NunitoSans-Bold",
} as const;

export const fontAssets = {
  "NunitoSans-Regular": require("../../assets/fonts/NunitoSans-Regular.ttf"),
  "NunitoSans-SemiBold": require("../../assets/fonts/NunitoSans-SemiBold.ttf"),
  "NunitoSans-Bold": require("../../assets/fonts/NunitoSans-Bold.ttf"),
} as const;
