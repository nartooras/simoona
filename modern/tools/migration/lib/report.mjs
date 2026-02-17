export function buildSummaryReport({ runAtUtc, source, mode, extracted, transformed, validation }) {
  return {
    run: {
      id: `dryrun-v1-${runAtUtc.replace(/[^0-9]/g, "")}`,
      runAtUtc,
      mode,
      source,
      dryRun: mode === "dry-run",
      writesExecuted: false,
    },
    counts: {
      extracted: extracted.counts,
      transformed: transformed.counts,
    },
    validation: {
      isValid: validation.isValid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      errors: validation.errors,
      warnings: validation.warnings,
    },
    unmappedFields: transformed.unmappedFields,
    assumptions: transformed.assumptions,
    todos: transformed.todos,
  };
}

function toBulletList(items) {
  if (items.length === 0) {
    return "- None";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function renderMarkdownReport(summary) {
  const errorLines = summary.validation.errors.map(
    (entry) => `- [${entry.code}] (${entry.entity}) ${entry.message}`,
  );
  const warningLines = summary.validation.warnings.map(
    (entry) => `- [${entry.code}] (${entry.entity}) ${entry.message}`,
  );

  return `# Data Migration Dry-Run v1 Report\n\n## Run\n- Run ID: ${summary.run.id}\n- Timestamp (UTC): ${summary.run.runAtUtc}\n- Mode: ${summary.run.mode}\n- Source: ${summary.run.source}\n- Writes executed: ${summary.run.writesExecuted ? "yes" : "no"}\n\n## Counts\n| Entity | Extracted | Transformed |\n|---|---:|---:|\n| users/profile basics | ${summary.counts.extracted.users} | ${summary.counts.transformed.usersProfileBasics} |\n| organization references | ${summary.counts.extracted.organizations} | ${summary.counts.transformed.organizationReferences} |\n| employee directory | ${summary.counts.extracted.employeeDirectory} | ${summary.counts.transformed.employeeDirectory} |\n| general settings essentials | ${summary.counts.extracted.generalSettings} | ${summary.counts.transformed.generalSettingsEssentials} |\n\n## Validation\n- Valid: ${summary.validation.isValid ? "yes" : "no"}\n- Errors: ${summary.validation.errorCount}\n- Warnings: ${summary.validation.warningCount}\n\n### Errors\n${toBulletList(errorLines)}\n\n### Warnings\n${toBulletList(warningLines)}\n\n## Unmapped Fields\n### users\n${toBulletList(summary.unmappedFields.users)}\n\n### organizations\n${toBulletList(summary.unmappedFields.organizations)}\n\n### employeeDirectory\n${toBulletList(summary.unmappedFields.employeeDirectory)}\n\n### generalSettings\n${toBulletList(summary.unmappedFields.generalSettings)}\n\n## Assumptions\n${toBulletList(summary.assumptions)}\n\n## TODOs\n${toBulletList(summary.todos)}\n`;
}
