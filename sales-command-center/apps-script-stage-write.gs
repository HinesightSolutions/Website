/**
 * Hinesight Solutions — Sales Command Center stage-write handler
 *
 * Add this code to the EXISTING Apps Script project that already receives
 * Hinesight Solutions webhooks. Keep your existing WEBHOOK_TOKEN/private token
 * in Script Properties or your existing CONFIG object. Do not place it in the
 * public website source.
 *
 * This handler updates Client Pipeline!G (Current Stage) and stamps Work Date
 * in Client Pipeline!F. It looks up the client by exact phone first, then by
 * exact client name if phone is omitted.
 */

const SALES_COMMAND_SPREADSHEET_ID = '1gcme175c7olwtYAagc93ossSjfqLetRgDPrJS0Snyns';
const SALES_COMMAND_SHEET_NAME = 'Client Pipeline';
const SALES_COMMAND_HEADER_ROW = 21;
const SALES_COMMAND_FIRST_DATA_ROW = 22;
const SALES_COMMAND_ALLOWED_STAGES = Object.freeze([
  'Positive Response',
  'Appointment Set',
  'Appointment Answered',
  'Pitch Completed',
  'Sold',
  'Not Interested',
  'Appointment Missed',
  'ACA Appointment'
]);

/**
 * Call this from your existing doPost(e) AFTER request parsing/token validation:
 *
 *   if (String(data.event || '') === 'sales_command_update_stage') {
 *     return handleSalesCommandStageUpdate_(data);
 *   }
 *
 * IMPORTANT: run this branch only after your existing private-token check.
 */
function handleSalesCommandStageUpdate_(data) {
  const requestedStage = String(data.stage || '').trim();
  const clientName = String(data.client_name || data.name || '').trim();
  const phone = normalizeSalesCommandPhone_(data.phone || '');

  if (SALES_COMMAND_ALLOWED_STAGES.indexOf(requestedStage) === -1) {
    return jsonResponse_({ ok: false, error: 'Invalid pipeline stage.' });
  }

  if (!clientName && !phone) {
    return jsonResponse_({ ok: false, error: 'Client name or phone is required.' });
  }

  const sheet = SpreadsheetApp
    .openById(SALES_COMMAND_SPREADSHEET_ID)
    .getSheetByName(SALES_COMMAND_SHEET_NAME);

  if (!sheet) {
    return jsonResponse_({ ok: false, error: 'Client Pipeline sheet not found.' });
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < SALES_COMMAND_FIRST_DATA_ROW) {
    return jsonResponse_({ ok: false, error: 'Client Pipeline is empty.' });
  }

  // A:N = 14 columns. A=name, B=phone, F=work date, G=stage.
  const values = sheet
    .getRange(SALES_COMMAND_FIRST_DATA_ROW, 1, lastRow - SALES_COMMAND_FIRST_DATA_ROW + 1, 14)
    .getDisplayValues();

  let matchIndex = -1;

  if (phone) {
    matchIndex = values.findIndex(function (row) {
      return normalizeSalesCommandPhone_(row[1]) === phone;
    });
  }

  if (matchIndex === -1 && clientName) {
    const wantedName = clientName.toLowerCase();
    matchIndex = values.findIndex(function (row) {
      return String(row[0] || '').trim().toLowerCase() === wantedName;
    });
  }

  if (matchIndex === -1) {
    return jsonResponse_({ ok: false, error: 'Client was not found in Client Pipeline.' });
  }

  const rowNumber = SALES_COMMAND_FIRST_DATA_ROW + matchIndex;
  const now = new Date();

  sheet.getRange(rowNumber, 6).setValue(now);       // Work Date (F)
  sheet.getRange(rowNumber, 7).setValue(requestedStage); // Current Stage (G)

  SpreadsheetApp.flush();

  return jsonResponse_({
    ok: true,
    updated: true,
    row: rowNumber,
    client_name: String(values[matchIndex][0] || clientName),
    stage: requestedStage
  });
}

function normalizeSalesCommandPhone_(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}
