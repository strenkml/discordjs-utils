import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const appendDiscordTypes = () => {
  const discordTypes = readFileSync(join(__dirname, "../src/types/discord.js/index.d.ts"), "utf-8");

  // Append to .d.ts
  const dtsPath = join(__dirname, "../dist/index.d.ts");
  const dtsContent = readFileSync(dtsPath, "utf-8");
  writeFileSync(dtsPath, dtsContent + "\n" + discordTypes);
  console.log("Discord.js types appended to .d.ts");

  // Append to .d.mts
  const mtsDtsPath = join(__dirname, "../dist/index.d.mts");
  const mtsDtsContent = readFileSync(mtsDtsPath, "utf-8");
  writeFileSync(mtsDtsPath, mtsDtsContent + "\n" + discordTypes);
  console.log("Discord.js types appended to .d.mts");
};

appendDiscordTypes();
