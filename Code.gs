// ============================================================
// Find Chaaya — Google Apps Script backend
// ============================================================
// This script sits between the private Google Sheet and the
// teashop map app. The sheet stays private; this script acts
// as a small API that the map calls to get shop data.
// ============================================================


// doGet() is the function Google runs whenever someone visits
// the Web App URL. The map calls this URL to get the shop
// data. Think of it like a tiny web server endpoint.

function doGet(e) {

  // Open the active spreadsheet (the one this script is
  // attached to) and get the first sheet in it.
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // getDataRange() selects all cells that have data.
  // getValues() reads them all into a 2D array.
  // So data[0] = the header row, data[1] = first shop, etc.
  var data = sheet.getDataRange().getValues();

  // Build an array of shop objects to return as JSON.
  var shops = [];

  // Start the loop at row index 1 (skipping row 0 which
  // is the header row: #, Teashop, Area, City, etc.)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // Skip completely empty rows (can happen at end of sheet)
    if (!row[1]) continue;

    // Map each column by its position in the sheet:
    // col 0 = #, col 1 = Teashop, col 2 = Area,
    // col 3 = City, col 4 = District, col 5 = State,
    // col 6 = Taste Rating, col 7 = Vibe Rating,
    // col 8 = Latitude, col 9 = Longitude,
    // col 10 = Google Maps Link
    shops.push({
      id:        row[0],
      name:      row[1],
      area:      row[2],
      city:      row[3],
      district:  row[4],
      state:     row[5],
      taste:     row[6],
      vibe:      row[7],
      lat:       row[8],
      lng:       row[9],
      gmaps:     row[10]
    });
  }

  // Wrap the shops array in a response object.
  // Adding a status field makes it easy to debug later.
  var response = {
    status: "ok",
    count: shops.length,
    shops: shops
  };

  // ContentService sends the data back as JSON text.
  // CORS header (setMimeType JSON) allows the map page to
  // fetch this data from a different domain (Vercel → Google)
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}