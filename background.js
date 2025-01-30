chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "/newtab/index.html" }); // newpage.html yerine açılacak sayfanın URL'sini yazabilirsiniz
  });
  