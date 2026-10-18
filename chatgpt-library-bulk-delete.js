(async () => {
  const CFG = {
    batchSize: 40,
    delay: 600,
    timeout: 6000,
    maxBatches: 1000
  };

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  const visible = el =>
    el?.isConnected &&
    el.getClientRects().length > 0;

  const buttons = () =>
    [...document.querySelectorAll(
      'button,[role="button"],[role="menuitem"]'
    )].filter(visible);

  const getLabel = el =>
    el.getAttribute("aria-label") ||
    el.innerText?.trim() || "";

  const waitFor = async fn => {
    const start = Date.now();

    while (Date.now() - start < CFG.timeout) {
      const result = fn();
      if (result) return result;
      await sleep(150);
    }

    return null;
  };

  if (
    location.hostname !== "chatgpt.com" ||
    location.pathname !== "/library"
  ) {
    throw Error("Open ChatGPT Library first.");
  }

  if (!confirm(
    "DELETE ALL LIBRARY FILES?\n\n" +
    "This operation may be irreversible.\n\n" +
    "Press OK to proceed."
  )) return;

  window.stopLibraryDelete = false;

  let totalSelected = 0;
  let batches = 0;

  console.log("Starting Library cleanup...");
  console.log(
    "Stop with: window.stopLibraryDelete = true"
  );

  while (
    batches < CFG.maxBatches &&
    !window.stopLibraryDelete
  ) {
    // Find currently unselected Library files.
    const selectors = buttons().filter(el =>
      /^Select .+/i.test(getLabel(el)) &&
      el.getAttribute("aria-checked") !== "true"
    );

    if (!selectors.length) {
      console.log(
        "No unselected visible files found."
      );
      break;
    }

    const batch = selectors.slice(0, CFG.batchSize);

    for (const el of batch) {
      if (window.stopLibraryDelete) break;

      el.click();
      await sleep(50);
    }

    if (window.stopLibraryDelete) break;

    console.log(
      `Selected ${batch.length} files.`
    );

    await sleep(CFG.delay);

    // Find bulk delete button after selection.
    const bulkDelete = buttons().find(el =>
      /^(delete|delete selected|delete files)$/i
        .test(getLabel(el))
    );

    if (!bulkDelete) {
      console.warn(
        "Bulk Delete button not found."
      );
      console.log(
        "Selection remains active for inspection."
      );
      break;
    }

    bulkDelete.click();

    const dialog = await waitFor(() =>
      [...document.querySelectorAll(
        '[role="dialog"],[role="alertdialog"]'
      )].find(visible)
    );

    if (dialog) {
      const confirmButton = [
        ...dialog.querySelectorAll("button")
      ].find(el =>
        /^delete/i.test(getLabel(el))
      );

      if (!confirmButton) {
        console.warn(
          "Confirmation button not found. Stopping."
        );
        break;
      }

      confirmButton.click();
    }

    await sleep(CFG.delay * 2);

    totalSelected += batch.length;
    batches++;

    console.log(
      `Batch ${batches} attempted: ${batch.length} files.`
    );
  }

  console.log("=== CLEANUP FINISHED ===");
  console.log("Batches attempted:", batches);
  console.log("Files submitted:", totalSelected);
  console.log(
    "Refresh Library to verify remaining files."
  );
})();
