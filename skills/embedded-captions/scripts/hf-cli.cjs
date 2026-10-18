// Resolve CLI ownership once for matting, transcription, and shell rendering.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
function hfCli(checkout) {
  const root = path.resolve(__dirname, "../../..");
  // A marketplace entry with "source": "./skills" makes skills/ itself the plugin root.
  const skills = path.resolve(__dirname, "../..");
  for (const dir of [checkout, process.env.HYPERFRAMES_ROOT].filter(Boolean)) {
    const cli = path.join(dir, "packages/cli/dist/cli.js");
    if (fs.existsSync(cli)) return cli;
  }
  const manifests = [
    "plugin.json",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    ".cursor-plugin/plugin.json",
    "gemini-extension.json",
  ];
  if (
    !fs.existsSync(path.join(root, "packages/cli/dist/cli.js")) &&
    [skills, root].some((dir) => manifests.some((p) => fs.existsSync(path.join(dir, p))))
  ) {
    return path.join(skills, "hyperframes/scripts/plugin-cli.mjs");
  }
  for (const dir of [root, path.join(os.homedir(), "Downloads/hyperframes")].filter(Boolean)) {
    const cli = path.join(dir, "packages/cli/dist/cli.js");
    if (fs.existsSync(cli)) return cli;
  }
  throw new Error(
    "HyperFrames CLI unavailable: install the full plugin or set HYPERFRAMES_ROOT to a built checkout.",
  );
}
module.exports = { hfCli };
if (require.main === module) console.log(hfCli(process.argv[2]));
