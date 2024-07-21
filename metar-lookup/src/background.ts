import * as index from './index.ts'; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchReport") {
      index.SendRequest(request.fieldCode, request.includeTAF, request.decode);
      sender;
      sendResponse({"data": "IDK"});
    }
  });