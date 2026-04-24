import { sweepOrphanedTestContacts } from "./ghl";

async function main() {
  const maxAgeArg = process.argv.find((a) => a.startsWith("--max-age="));
  const maxAgeMinutes = maxAgeArg ? Number(maxAgeArg.split("=")[1]) : 60;

  if (!Number.isFinite(maxAgeMinutes) || maxAgeMinutes < 0) {
    console.error("Invalid --max-age value; expected positive number of minutes");
    process.exit(1);
  }

  console.log(`Sweeping orphaned test contacts older than ${maxAgeMinutes} minute(s)...`);
  const result = await sweepOrphanedTestContacts(maxAgeMinutes);
  console.log(
    `Scanned ${result.scanned} contact(s); deleted ${result.deleted}.${
      result.deletedIds.length ? `\n  ids: ${result.deletedIds.join(", ")}` : ""
    }`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
