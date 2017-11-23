$(function(){

  let thisResHTMLCode = "",
      hontoItemCode = "",
      bookStoreNameList = "",
      targetAmazonSearchResultItemNum = 0;

  $("ul > li[id*='result']").each(function(){
    targetAmazonSearchResultItemAsin = $(this).attr("data-asin");
    if(targetAmazonSearchResultItemAsin % 1 === 0 || targetAmazonSearchResultItemAsin[targetAmazonSearchResultItemAsin.length - 1] === "X") getInfoByHonto(ISBN.parse($(this).attr("data-asin")).asIsbn13(true));
  });

  function getInfoByHonto(isbn13Code){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      pageURLToHontoItemInfo = $(this.responseXML).find(".stHeading").children("a").attr("href");
      getBookStockInfoInjunkudo(pageURLToHontoItemInfo);
    }
    xhr.open("GET", "https://honto.jp/netstore/search_10" + isbn13Code + ".html?srchf=1&tbty=0");
    xhr.responseType = "document";
    xhr.send();
  }

  function getBookStockInfoInjunkudo(pageURLToHontoItemInfo){
    hontoItemCode = pageURLToHontoItemInfo.split(/https:\/\/honto\.jp\/netstore\/pd-book_|\.html/)[1];
    pageURLToBookStockInfoInjunkudo = 'https://honto.jp/netstore/pd-store_06'+hontoItemCode+'_14HB320.html'
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      bookStoreNameList = "<nobr>";
      $(this.responseXML).find('.stIconStock01').each(function(){
        bookStoreNameList += $(this).next().text() + "<br>";
      });
      bookStoreNameList += "</nobr>";
      $("ul > li[id*='result']").eq(targetAmazonSearchResultItemNum).after("<iframe srcdoc='"+bookStoreNameList+"'></iframe>");
      targetAmazonSearchResultItemNum++;
    }
    xhr.open("GET", pageURLToBookStockInfoInjunkudo);
    xhr.responseType = "document";
    xhr.send();
  }

});
