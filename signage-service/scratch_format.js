// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
const raw = fs.readFileSync("scratch_ar_extracted_clean.txt", "utf8");
// Wrap it in an assignment so we can eval it
const obj = eval("({" + raw + "})");
// Format it nicely
const formatted = JSON.stringify(obj, null, 2);
fs.writeFileSync("scratch_ar_formatted.json", formatted, "utf8");
console.log("Formatted and saved to scratch_ar_formatted.json!");
