(function () {
    $(function () {
        const URL = "https://api.coingecko.com/api/v3/coins";
        const LIVEURL = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="
        const TOUSD = "&tsyms=USD"

        let coinsArea = $("#coinsArea");
        let homePage = $("#home");
        let aboutPage = $("#about");
        let livePage = $("#live");


        let allCoinsCache = new Array();
        let moreInfoCache = new Map();
        let checkedCoinsCache = new Array();
        let toggleStateUpdated = new Array();
        let detailedToggleState = new Array();

        let togglesLimit = 5;
        let chartUpdateInterval;

        let options = {
            exportEnabled: true,
            title: {
                text: ""
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "Coins legend"
            },
            axisY: {
                title: "Price (USD)",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: []
        };

        createCoinsBoard();



        $("#home").click(function () {
            initLiveReports();

            manageActivePage(homePage, aboutPage, livePage);

            createCoinsBoard();
        });

        $("#about").click(function () {
            initLiveReports()
            clearScreen();

            manageActivePage(aboutPage, homePage, livePage);

            showAboutMeOnUI();
        });

        $("#live").click(function () {
            clearScreen();

            manageActivePage(livePage, aboutPage, homePage);

            liveReportsValidation();
        });

        $("#searchBTN").click(function () {
            initLiveReports();

            livePage.removeClass("active");
            aboutPage.removeClass("active");
            homePage.removeClass("active");

            let searchInput = $("#searchInput");
            let searchInputValue = searchInput.val();

            searchInput.val("");

            if (!isSearchInputValueValid(searchInputValue)) {
                manageActivePage(homePage, aboutPage, livePage);

                createCoinsBoard();
                return;
            }

            let searchResult = allCoinsCache.filter(val => val.symbol == searchInputValue);

            showCoinsOnUI(searchResult);
        });

        function manageActivePage(currentPage, otherPage1, otherPage2) {
            currentPage.addClass("active");
            otherPage1.removeClass("active");
            otherPage2.removeClass("active");
        }

        function showAboutMeOnUI() {
            let aboutMeCover = $("<div>");
            aboutMeCover.addClass("parallax");
            coinsArea.append(aboutMeCover);

            let aboutHeadline = $("<h1>");
            aboutHeadline.addClass("headline");
            aboutHeadline.html("Nice to meet");
            aboutMeCover.append(aboutHeadline);

            let aboutText = $("<p>");
            aboutText.addClass("aboutText");
            aboutText.html("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat, justo vel mollis feugiat, odio orci imperdiet leo, a pellentesque turpis erat sit amet neque. Nullam auctor dapibus blandit. Cras non sem sit amet est rhoncus commodo vitae non sem. Morbi est metus, auctor eu viverra nec, tincidunt vel libero. Morbi gravida nec augue a dapibus. Curabitur aliquet leo nec convallis rhoncus. Sed elit neque, viverra et sapien eget, ornare maximus ante. In tellus libero, pharetra eget feugiat at, finibus sed orci. Aenean eget porttitor quam. Nullam id ipsum mi. <br> Phasellus luctus nisl in risus interdum blandit. Cras mollis sapien non orci tempor sodales. Cras efficitur bibendum nibh. Phasellus massa elit, lacinia in hendrerit at, cursus ac dolor. Fusce lobortis tellus non efficitur ultrices. Morbi mattis elit ac quam sollicitudin placerat ut sit amet massa. Aliquam dignissim consequat sem, quis dapibus dolor cursus ac. Morbi vitae urna eu metus dictum rhoncus eget sed ipsum. Pellentesque tempor lectus ipsum, non ultricies nisi accumsan non.<br>Integer tincidunt a tellus in efficitur. Nulla eu elementum neque, vitae faucibus risus. Maecenas luctus, leo et maximus fermentum, velit velit blandit orci, nec convallis odio purus eget lacus. Morbi et sem a tellus tristique vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec aliquet elit non ipsum laoreet, nec suscipit lacus interdum. Nullam ultricies eros sed turpis lobortis blandit.");
            coinsArea.append(aboutText);

            let aboutProjectCover = $("<div>");
            aboutProjectCover.addClass("coinsParallax");
            coinsArea.append(aboutProjectCover);

            let aboutProjectHeadline = $("<h1>");
            aboutProjectHeadline.addClass("headline");
            aboutProjectHeadline.html("About the project");
            aboutProjectCover.append(aboutProjectHeadline);

            let aboutProjectText = $("<p>");
            aboutProjectText.addClass("aboutText");
            aboutProjectText.html("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat, justo vel mollis feugiat, odio orci imperdiet leo, a pellentesque turpis erat sit amet neque. Nullam auctor dapibus blandit. Cras non sem sit amet est rhoncus commodo vitae non sem. Morbi est metus, auctor eu viverra nec, tincidunt vel libero. Morbi gravida nec augue a dapibus. Curabitur aliquet leo nec convallis rhoncus. Sed elit neque, viverra et sapien eget, ornare maximus ante. In tellus libero, pharetra eget feugiat at, finibus sed orci. Aenean eget porttitor quam. Nullam id ipsum mi. <br> Phasellus luctus nisl in risus interdum blandit. Cras mollis sapien non orci tempor sodales. Cras efficitur bibendum nibh. Phasellus massa elit, lacinia in hendrerit at, cursus ac dolor. Fusce lobortis tellus non efficitur ultrices. Morbi mattis elit ac quam sollicitudin placerat ut sit amet massa. Aliquam dignissim consequat sem, quis dapibus dolor cursus ac. Morbi vitae urna eu metus dictum rhoncus eget sed ipsum. Pellentesque tempor lectus ipsum, non ultricies nisi accumsan non.<br>Integer tincidunt a tellus in efficitur. Nulla eu elementum neque, vitae faucibus risus. Maecenas luctus, leo et maximus fermentum, velit velit blandit orci, nec convallis odio purus eget lacus. Morbi et sem a tellus tristique vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec aliquet elit non ipsum laoreet, nec suscipit lacus interdum. Nullam ultricies eros sed turpis lobortis blandit.");
            coinsArea.append(aboutProjectText);
        }

        function liveReportsValidation() {
            if (checkedCoinsCache.length == 0) {

                let britneyError = $("<div>");
                britneyError.attr("id", "britneyError");
                coinsArea.append(britneyError);


                let aboutHeadline = $("<h2>");
                aboutHeadline.html("Oops! <br> You didn't mark coins to show,<br> You can go Home and pick some coins <br> or to About to read about me");
                aboutHeadline.addClass("headline");
                britneyError.append(aboutHeadline);

                let freeBritney = $("<iframe>");
                freeBritney.attr("id", "freeBritney");
                freeBritney.attr("src", "https://www.youtube.com/embed/CduA0TULnow");
                freeBritney.attr("frameborder", "0");
                freeBritney.attr("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
                freeBritney.attr("allowfullscreen", true)
                britneyError.append(freeBritney);
            }
            else {
                let chartContainer = $("<div>");
                chartContainer.attr("id", "chartContainer")
                coinsArea.append(chartContainer);

                createLiveReport();
                chartUpdateInterval = setInterval(function () { updateLiveReport() }, 2000);
            }
        }

        function updateLiveReport() {
            $.get(LIVEURL + checkedCoinsCache + TOUSD).then(function (rates) {

                for (let [key, value] of Object.entries(rates)) {
                    for (let index = 0; index < options.data.length; index++) {
                        if (options.data[index].name == key) {
                            let dataPoints = { x: new Date(), y: value.USD };
                            options.data[index].dataPoints.push(dataPoints);
                        }

                    }
                }
                $("#chartContainer").CanvasJSChart(options);
            })
                .catch(error => {
                    alert("Oops, Something went wrong with server, Please try again later");
                    console.log(error);
                });
        }

        function createLiveReport() {

            options.title.text = checkedCoinsCache + " to USD";

            $.get(LIVEURL + checkedCoinsCache + TOUSD).then(function (rates) {

                for (let [key, value] of Object.entries(rates)) {
                    let dataObj = {
                        type: "spline",
                        name: key,
                        showInLegend: true,
                        xValueFormatString: "MMM YYYY",
                        yValueFormatString: "#,##0 USD",
                        dataPoints: [{ x: new Date(), y: value.USD }]
                    }

                    options.data.push(dataObj);
                }
                $("#chartContainer").CanvasJSChart(options);
            })
                .catch(error => {
                    alert("Oops, Something went wrong with server, Please try again later");
                    console.log(error);
                });
        }

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

        function isSearchInputValueValid(searchInputValue) {
            if (searchInputValue.trim().length == 0) {
                alert("Please enter a value for search");
                return false;
            }
            if (allCoinsCache.find(val => val.symbol == searchInputValue) == undefined) {
                alert("Sorry, Couldn't find the coin in our list");
                return false;
            }
            return true;
        }

        function createCoinsBoard() {
            if (allCoinsCache.length == 0) {
                console.log("no coins in cache");
                getCoinsFromServer();

            } else {
                console.log("getting coins from cache");
                showCoinsOnUI(allCoinsCache);
            }

        }

        function getCoinsFromServer() {
            $.get(URL).then(function (coins) {
                console.log("getting coins from server");
                allCoinsCache = coins.slice(0, 100);
                showCoinsOnUI(allCoinsCache);
            })
                .catch(error => {
                    alert("Oops, Something went wrong with server, Please try again later");
                    console.log(error);
                });
        }

        function showCoinsOnUI(coinsArray) {
            clearScreen();

            for (let coin of coinsArray) {
                let coinCard = createCoinCardUI(coinsArea);
                let coinBody = createCoinCardBodyUI(coinCard);
                let toggleBTN = addCardToggleUI(coinBody, coin);

                toggleBTN.change(onToggleClicked);

                if (checkedCoinsCache.includes(coin.symbol)) {
                    toggleBTN.attr("checked", "checked");
                }

                addCoinSymbolUI(coinBody, coin);
                addCoinNameUI(coinBody, coin);
                addMoreInfoBtnUI(coinBody, coin)

            }
        }

        function createCoinCardUI(coinsArea) {
            let newCard = $("<div>");
            newCard.addClass("card");
            coinsArea.append(newCard);
            return newCard;
        }

        function createCoinCardBodyUI(newCard) {
            let cardBody = $("<div>");
            cardBody.addClass("card-body");
            newCard.append(cardBody);
            return cardBody;
        }

        function addCardToggleUI(cardBody, coin) {
            let switchArea = $("<label>");
            switchArea.addClass("switch");
            cardBody.append(switchArea);

            let switchCheckBox = $("<input>");
            switchCheckBox.attr("type", "checkbox");
            switchCheckBox.attr("id", coin.symbol);
            switchArea.append(switchCheckBox);

            let switchLabel = $("<span>");
            switchLabel.addClass("slider round");
            switchArea.append(switchLabel);

            return switchCheckBox;
        }

        function addCoinSymbolUI(cardBody, coin) {
            let coinSymbol = $("<h5>");
            coinSymbol.addClass("card-title coinSymbol");
            coinSymbol.html(coin.symbol);
            cardBody.append(coinSymbol);
        }

        function addCoinNameUI(cardBody, coin) {
            let coinName = $("<p>");
            coinName.addClass("card-text coinName");
            coinName.html(coin.name);
            cardBody.append(coinName);
        }

        function addMoreInfoBtnUI(cardBody, coin) {
            let moreInfoBTN = $("<button>");
            moreInfoBTN.addClass("btn btn-info moreInfoBTN");
            moreInfoBTN.attr("id", coin.id);
            moreInfoBTN.html("More info");
            moreInfoBTN.click(onMoreInfoBTNClicked);
            cardBody.append(moreInfoBTN);
        }

        function onToggleClicked() {
            let currentToggle = $(this);
            let currentCoinSymbol = $(this)[0].id;

            setToggleState(currentToggle, currentCoinSymbol, checkedCoinsCache)

            checkCheckedTogglesLimit();
        }

        function setToggleState(currentToggle, currentCoinSymbol, checkedCoinsCache) {
            if (currentToggle.is(":checked")) {
                currentToggle.attr("checked", "checked");
                checkedCoinsCache.push(currentCoinSymbol);
            }
            else {
                currentToggle.removeAttr("checked");

                let coinIndexToRemove = checkedCoinsCache.indexOf(currentCoinSymbol);
                checkedCoinsCache.splice(coinIndexToRemove, 1);
            }
        }

        function checkCheckedTogglesLimit() {
            //limit to 5 choices
            if (checkedCoinsCache.length == (togglesLimit + 1)) {
                for (let index = 0; index < checkedCoinsCache.length; index++) {
                    let detailedToggleInfo = allCoinsCache.find(val => val.symbol == checkedCoinsCache[index]);
                    detailedToggleState[index] = detailedToggleInfo;
                }

                toggleStateUpdated = checkedCoinsCache.slice();
                createModalOnUI();
            }
        }

        function createModalOnUI() {
            let modalBG = $("<div>");
            modalBG.addClass("popUp");
            $("body").append(modalBG);

            let modalContainer = $("<div>");
            modalContainer.addClass("modalContainer")
            modalBG.append(modalContainer);

            let modalHeader = $("<div>");
            modalHeader.addClass("modalHeader");
            modalHeader.html("You can choose only 5 coins for live reports.<br>Please choose a coin to remove or cancel to go back to previous choice.");
            modalContainer.append(modalHeader);

            let modalBody = $("<div>");
            modalBody.addClass("modalBody");
            modalContainer.append(modalBody);

            showCoinsOnModalUI(modalBody, detailedToggleState);

            let modalFooter = $("<div>");
            modalFooter.addClass("modalFooter");
            modalContainer.append(modalFooter);

            let saveButton = $("<button>");
            saveButton.addClass("btn btn-info");
            saveButton.attr("id", "saveButton");
            saveButton.text("Save changes");
            saveButton.click(onSaveButtonClicked);
            modalFooter.append(saveButton);

            let cancelButton = $("<button>");
            cancelButton.addClass("btn btn-secondary");
            cancelButton.attr("id", "cancelButton");
            cancelButton.text("Cancel");
            cancelButton.click(onCancelButtonClicked);
            modalFooter.append(cancelButton);
        }

        function showCoinsOnModalUI(modalBody, coins) {
            for (let coin of coins) {
                let coinCard = createCoinCardUI(modalBody);
                let coinBody = createCoinCardBodyUI(coinCard);
                let toggleBTN = addCardToggleUI(coinBody, coin);

                toggleBTN.attr("checked", "checked");
                toggleBTN.click(() => onModalToggleClicked(coin, toggleBTN));

                addCoinSymbolUI(coinBody, coin);
                addCoinNameUI(coinBody, coin);
            }
        }

        function onModalToggleClicked(coin, toggleBTN) {
            let currentCoinSymbol = coin.symbol;

            setToggleState(toggleBTN, currentCoinSymbol, toggleStateUpdated);
        }

        function onSaveButtonClicked() {
            //VALIDATION
            if (toggleStateUpdated.length == (togglesLimit + 1)) {
                alert("You can save only 5 coins for live reports");
                return;
            }

            $(".popUp").remove();

            checkedCoinsCache = toggleStateUpdated;

            showCoinsOnUI(allCoinsCache);
        }

        function onCancelButtonClicked() {
            alert("We canceled your last choice");
            $(".popUp").remove();

            //remove the last added toggle
            checkedCoinsCache.pop();
            showCoinsOnUI(allCoinsCache);
        }

        function onMoreInfoBTNClicked() {
            let currentBTN = $(this);

            let clicks = currentBTN.data('clicks');

            if (clicks) {
                hideMoreInfo(currentBTN);
            } else {
                getMoreInfoDetails(currentBTN);
            }
            currentBTN.data("clicks", !clicks);
        }

        function getMoreInfoDetails(currentBTN) {
            let currentCoinId = currentBTN[0].id;
            let currentCoinCardBody = currentBTN.parent();

            if (moreInfoCache.has(currentCoinId)) {
                let coinInfo = moreInfoCache.get(currentCoinId);
                addMoreInfoToUI(currentBTN, coinInfo, currentCoinCardBody);
            }
            else {
                currentBTN.attr("disabled", true);
                createPreloader(currentCoinCardBody, currentCoinId)

                $.get(URL + "/" + currentCoinId).then(function (currentCoinDetails) {
                    let ilsCurrency = currentCoinDetails.market_data.current_price.ils;
                    let usdCurrency = currentCoinDetails.market_data.current_price.usd;
                    let eurCurrency = currentCoinDetails.market_data.current_price.eur;
                    let coinImage = currentCoinDetails.image.large;

                    let coinInfo = {
                        ils: ilsCurrency,
                        usd: usdCurrency,
                        eur: eurCurrency,
                        image: coinImage
                    }

                    moreInfoCache.set(currentCoinId, coinInfo);

                    //need to change to 120000
                    setTimeout(function () {
                        moreInfoCache.delete(currentCoinId);
                    }, 120000);

                    addMoreInfoToUI(currentBTN, coinInfo, currentCoinCardBody);
                    hidePreloader(currentCoinId);
                    currentBTN.attr("disabled", false);

                })
                    .catch(error => {
                        alert("Oops, Something went wrong with server, Please try again later");
                        console.log(error);
                    });
            }

        }

        function addMoreInfoToUI(currentBTN, coinInfo, currentCoinCardBody) {
            currentBTN.html("Less info")

            let collapser = $("<div>");
            collapser.addClass("collapser");
            currentCoinCardBody.append(collapser);

            let ilsImage = $("<img>");
            ilsImage.addClass("moreInfoImage");
            ilsImage.attr("src", "images/ils.svg");
            collapser.append(ilsImage);

            let ilsVal = $("<p>");
            ilsVal.addClass("moreInfoText");
            ilsVal.html(coinInfo.ils);
            collapser.append(ilsVal);

            let usdImage = $("<img>");
            usdImage.addClass("moreInfoImage");
            usdImage.attr("src", "images/dollar.svg");
            collapser.append(usdImage);

            let usdVal = $("<p>");
            usdVal.addClass("moreInfoText");
            usdVal.html(coinInfo.usd);
            collapser.append(usdVal);

            let eurImage = $("<img>");
            eurImage.addClass("moreInfoImage");
            eurImage.attr("src", "images/euro.svg");
            collapser.append(eurImage);

            let eurVal = $("<p>");
            eurVal.addClass("moreInfoText");
            eurVal.html(coinInfo.eur);
            collapser.append(eurVal);

            let image = $("<img>");
            image.attr("src", coinInfo.image);
            image.addClass("currencyImage");
            collapser.append(image);

        }

        function hideMoreInfo(currentBTN) {
            currentBTN.html("More Info");

            currentBTN.next().remove();
        }

        function createPreloader(currentCardBody, currentCoin) {
            let preloader = $("<img>")
            preloader.addClass("preloader");
            preloader.addClass(currentCoin);
            preloader.attr("src", "images/preloader.gif");
            currentCardBody.append(preloader);
        }

        let hidePreloader = (currentCoin) => $(".preloader." + currentCoin).remove();

        //INIT coinsArea div
        let clearScreen = () => coinsArea.empty();

        function initLiveReports() {
            clearInterval(chartUpdateInterval);
            options.data = [];
            $("#chartContainer").remove();
            $("#britneyError").remove();
        }
    });
})();