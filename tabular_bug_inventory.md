Review this package’s source code, tests, and documentation for bugs. Save the findings in `BUGS.md` at the package root. Title the table **`<Package Name> Bug Inventory`**. Use one row per distinct bug, ordered from highest to lowest severity, and briefly define the severity scale.

Include these five columns:

| Column | What to include |
| --- | --- |
| ID | A unique numeric identifier for the bug. |
| Severity | A rating based on the impact and the conditions required to trigger the bug. |
| Short description | One sentence naming the observable failure. |
| Details | Explain what triggers the bug, what should happen, what happens instead, and how the code causes it. Link to the relevant source and include a minimal reproduction or step-by-step trace that a reader unfamiliar with the package can follow. |
| Outstanding questions | Identify any uncertainty about intended behavior, affected cases, or impact. Write “None” when the evidence settles the issue. |

Ground each finding in reproducible behavior or a specific code path. State whether you ran the example or inferred the outcome from inspection.