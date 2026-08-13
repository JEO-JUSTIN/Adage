/**
 * Google Apps Script for ADAGE'26 UPI Payment Screenshot Storage
 * 
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com/ and create a new project named "ADAGE UPI Drive Uploader".
 * 2. Paste this entire code into Code.gs.
 * 3. (Optional) Create a Google Drive folder named "ADAGE_UPI_Screenshots" and copy its Folder ID into FOLDER_ID below.
 *    If left empty, files will be saved in your root Google Drive under "ADAGE_UPI_Screenshots".
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Execute as: "Me" (your Google account).
 * 7. Who has access: "Anyone" (allows registration form to upload).
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 9. Paste the URL into your project's .env file as:
 *    VITE_GOOGLE_DRIVE_WEBAPP_URL=https://script.google.com/macros/s/.../exec
 */

const FOLDER_ID = ""; // Optional folder ID

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var filename = contents.filename || "UPI_Screenshot_" + new Date().getTime() + ".png";
    var mimeType = contents.mimeType || "image/png";
    var base64Data = contents.base64Data;
    
    if (!base64Data) {
      return responseJSON({ status: "error", message: "Missing base64 file data" });
    }
    
    if (base64Data.indexOf(",") !== -1) {
      base64Data = base64Data.split(",")[1];
    }
    
    var decodedData = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedData, mimeType, filename);
    
    var folder;
    if (FOLDER_ID && FOLDER_ID.trim() !== "") {
      folder = DriveApp.getFolderById(FOLDER_ID.trim());
    } else {
      var folders = DriveApp.getFoldersByName("ADAGE_UPI_Screenshots");
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder("ADAGE_UPI_Screenshots");
      }
    }
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var driveUrl = "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing";
    var directImageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    return responseJSON({
      status: "success",
      fileId: fileId,
      driveUrl: driveUrl,
      directImageUrl: directImageUrl,
      filename: filename
    });
    
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  return responseJSON({ status: "active", message: "ADAGE Google Drive Uploader Endpoint is Live." });
}

function responseJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
