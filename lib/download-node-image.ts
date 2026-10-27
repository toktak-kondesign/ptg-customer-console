import { toBlob } from "html-to-image";

export const downloadNodeAsImage = async (
  node: HTMLElement,
  filename: string,
) => {
  const blob = await toBlob(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
  if (!blob) throw new Error("Failed to render image");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
