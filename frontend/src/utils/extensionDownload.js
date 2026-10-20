import manifestSource from "../../../extension/manifest.json?raw";
import background from "../../../extension/background.js?raw";
import popupHtml from "../../../extension/popup.html?raw";
import popupCss from "../../../extension/popup.css?raw";
import popupJs from "../../../extension/popup.js?raw";
import readme from "../../../extension/README.md?raw";
import icon16 from "../../../extension/icons/icon16.png?url";
import icon32 from "../../../extension/icons/icon32.png?url";
import icon48 from "../../../extension/icons/icon48.png?url";
import icon128 from "../../../extension/icons/icon128.png?url";

const encoder = new TextEncoder();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function writeUint32(view, offset, value) {
  view.setUint32(offset, value, true);
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data =
      typeof file.content === "string"
        ? encoder.encode(file.content)
        : file.content;
    const crc = crc32(data);
    const localHeader = new ArrayBuffer(30 + name.length);
    const localView = new DataView(localHeader);

    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint32(localView, 14, crc);
    writeUint32(localView, 18, data.length);
    writeUint32(localView, 22, data.length);
    writeUint16(localView, 26, name.length);
    new Uint8Array(localHeader, 30).set(name);
    localParts.push(new Uint8Array(localHeader), data);

    const centralHeader = new ArrayBuffer(46 + name.length);
    const centralView = new DataView(centralHeader);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint32(centralView, 16, crc);
    writeUint32(centralView, 20, data.length);
    writeUint32(centralView, 24, data.length);
    writeUint16(centralView, 28, name.length);
    writeUint32(centralView, 42, offset);
    new Uint8Array(centralHeader, 46).set(name);
    centralParts.push(new Uint8Array(centralHeader));
    offset += localHeader.byteLength + data.length;
  }

  const centralSize = centralParts.reduce(
    (total, part) => total + part.length,
    0,
  );
  const endHeader = new ArrayBuffer(22);
  const endView = new DataView(endHeader);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 8, files.length);
  writeUint16(endView, 10, files.length);
  writeUint32(endView, 12, centralSize);
  writeUint32(endView, 16, offset);

  return new Blob([...localParts, ...centralParts, new Uint8Array(endHeader)], {
    type: "application/zip",
  });
}

const iconUrls = { 16: icon16, 32: icon32, 48: icon48, 128: icon128 };

export async function downloadExtension() {
  const manifest = JSON.parse(manifestSource);
  const icons = await Promise.all(
    Object.entries(iconUrls).map(async ([size, url]) => ({
      name: `icons/icon${size}.png`,
      content: await fetchExtensionAsset(url),
    })),
  );

  const files = [
    ...icons,
    { name: "manifest.json", content: JSON.stringify(manifest, null, 2) },
    { name: "background.js", content: background },
    { name: "popup.html", content: popupHtml },
    { name: "popup.css", content: popupCss },
    { name: "popup.js", content: popupJs },
    { name: "README.md", content: readme },
  ];
  const url = URL.createObjectURL(createZip(files));
  const link = document.createElement("a");
  link.href = url;
  link.download = "securix-quickscan-extension.zip";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function fetchExtensionAsset(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not package extension asset (${response.status}).`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
