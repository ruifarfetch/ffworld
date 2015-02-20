// ************* Web.UI.ShopNav.Engine class **************
/*
  Type:
  1 - Events
  2 - Partial Page SEO for Action
  3 - Full Page SEO for View
*/

var enmGAAsyncCalls =
{
    "Events": 1,
    "SEOPartial": 2,
    "SEOTotal": 3
};
// ************* Web.UI.ShopNav.Engine class **************
var Web_UI_ShopNav_Engine = $.Class.create
        (
// ********************* CONSTRUCTOR *********************
          {
              initialize: function (
                            QSFilterIdentifier,
                            QSFilterSeparator,
                            QSFilterIdentifierDeep,
                            QSFilterValueIdentifier,
                            QSFilterValueSeparator,
                            QSFilterKeySeparator,
                            QSFilterLastSel,
                            QSCleanerProps,
                            QSCleanerValues,
                            QSPagingSelectorIdentifier,
                            QSPagingViewIdentifier,
                            QSPagingTotalIdentifier,
                            QSPagingTypeIdentifier,
                            QSOrderTypeIdentifier,
                            QSScrollIdentifier,
                            GASpecificCode,
                            QSPriceIdentifier,
                            QSPriceValueSeparator,
                            OnlyItemsOn,
                            ContentVersion,
                            SiteIsVerBR
              ) {
                  //PRIVATES
                  this._arrFilters = [];
                  this._arrAjaxGetData = [];

                  //PUBLICS
                  this._QSFilterIdentifier = QSFilterIdentifier;
                  this._QSFilterSeparator = QSFilterSeparator;
                  this._QSFilterIdentifierDeep = QSFilterIdentifierDeep;
                  this._QSFilterValueIdentifier = QSFilterValueIdentifier;
                  this._QSFilterValueSeparator = QSFilterValueSeparator;
                  this._QSFilterKeySeparator = QSFilterKeySeparator;
                  this._QSFilterLastSel = QSFilterLastSel;

                  this._QSCleanerProps = QSCleanerProps;
                  this._QSCleanerValues = QSCleanerValues;

                  this._QSPagingSelectorIdentifier = QSPagingSelectorIdentifier;
                  this._QSPagingViewIdentifier = QSPagingViewIdentifier;
                  this._QSPagingTotalIdentifier = QSPagingTotalIdentifier;
                  this._QSPagingTypeIdentifier = QSPagingTypeIdentifier;
                  this._QSPagingGoToIdentifier = "goto";

                  this._QSOrderTypeIdentifier = QSOrderTypeIdentifier;

                  this._QSPriceIdentifier = QSPriceIdentifier;
                  this._QSPriceValueSeparator = QSPriceValueSeparator;

                  this._PageLoading = false; // Page is not loading, by default.
                  this._PageInit = true; // Initial (first time) page Loading

                  this._GASpecificCode = null;
                  this._GAAltTracker = null;
                  this._TranslationTerms = null;

                  this._OnlyItemsOn = OnlyItemsOn;
                  if (!ContentVersion) {
                      ContentVersion = 1;
                  }
                  this._ContentVersion = ContentVersion;
                  this._SiteIsVerBR = SiteIsVerBR;
              },


              // ********************* METHODS *********************
              RankingConsoleRefresh: function () {
                  var $radNoOrder = $("#cradNoOrder > input");
                  var $radRankStock = $("#cradRankStock > input");
                  var $radRankNoStockRate = $("#cradRankNoStockRate > input");
                  var $radSizeAvailable = $("#cradSizeAvailable > input");
                  var $radRankViews = $("#cradRankViews > input");
                  var $radRankBaskets = $("#cradRankBaskets > input");
                  var $radRankOrders = $("#cradRankOrders > input");
                  var $radRankUpLoadDate = $("#cradRankUpLoadDate > input");

                  var $xekRankStock = $("#cxekRankStock > input");
                  var $xekRankNoStockRate = $("#cxekRankNoStockRate > input");
                  var $xekSizeAvailable = $("#cxekSizeAvailable > input");
                  var $xekRankViews = $("#cxekRankViews > input");
                  var $xekRankBaskets = $("#cxekRankBaskets > input");
                  var $xekRankOrders = $("#cxekRankOrders > input");
                  var $xekRankUpLoadDate = $("#cxekRankUpLoadDate > input");

                  var xhr = $.ajax({
                      url: window.universal_variable.page.subfolder + "/FFAPI/MultiSelect.asmx/RankingConsoleRefresh",
                      type: "POST",
                      dataType: "json",
                      contentType: "application/json; charset=utf-8",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
                      },
                      data: "{" +
                              "radNoOrder: '" + $radNoOrder.is(':checked') + "', " +
                              "radRankStock: '" + $radRankStock.is(':checked') + "', " +
                              "radRankNoStockRate: '" + $radRankNoStockRate.is(':checked') + "', " +
                              "radSizeAvailable: '" + $radSizeAvailable.is(':checked') + "', " +
                              "radRankViews: '" + $radRankViews.is(':checked') + "', " +
                              "radRankBaskets: '" + $radRankBaskets.is(':checked') + "', " +
                              "radRankOrders: '" + $radRankOrders.is(':checked') + "', " +
                              "radRankUpLoadDate: '" + $radRankUpLoadDate.is(':checked') + "', " +
                              "xekRankStock: '" + $xekRankStock.is(':checked') + "', " +
                              "xekRankNoStockRate: '" + $xekRankNoStockRate.is(':checked') + "', " +
                              "xekSizeAvailable: '" + $xekSizeAvailable.is(':checked') + "', " +
                              "xekRankViews: '" + $xekRankViews.is(':checked') + "', " +
                              "xekRankBaskets: '" + $xekRankBaskets.is(':checked') + "', " +
                              "xekRankOrders: '" + $xekRankOrders.is(':checked') + "', " +
                              "xekRankUpLoadDate: '" + $xekRankUpLoadDate.is(':checked') + "'" +
                            "}",
                      success: function (msg) {
                          WebUIShopNavEngine.FilterGet(0, 0, 0, false);
                      },
                      error: function (e) {
                          WebUIShopNavEngine.LoadingMSGHide();
                          window.location.reload();
                      }
                  });
              },
              RankingSet: function (RankContext, Rank, RankNew, ArtigoID, lngContextKey, strContextKeyDesc, permissions) {
                  var xhr = $.ajax({
                      url: window.universal_variable.page.subfolder+"/FFAPI/MultiSelect.asmx/RankingSet",
                      type: "POST",
                      dataType: "json",
                      contentType: "application/json; charset=utf-8",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
                      },
                      data: "{" +
                    "RankContext: '" + RankContext + "', " +
                    "Rank: '" + Rank + "', " +
                    "RankNew: '" + RankNew + "', " +
                    "ArtigoID: '" + ArtigoID + "', " +
                    "ContextKey: '" + lngContextKey + "', " +
                    "ContextKeyDesc: '" + strContextKeyDesc + "', " +
                    "Permissions: '" + permissions + "', " +
                    "URL: '" + window.location.href + "'" +
                  "}",
                      success: function (msg) {
                          WebUIShopNavEngine.FilterGet(0, 0, 0, false);
                      },
                      error: function (e) {
                          WebUIShopNavEngine.LoadingMSGHide();
                          window.location.reload();
                      }
                  });
              },
              LoadingMSGShow: function () {
                  $("#wait").removeClass('hide');
                  this._PageLoading = true;
              },
              LoadingMSGHide: function () {
                  $("#wait").addClass('hide');
                  this._PageLoading = false;
              },
              DisplayError: function () {
                  $.fancybox(
                            $("#errorDiv").html(),
                            {
                                'padding': 10,
                                'hideOnOverlayClick': true,
                                'enableEscapeButton': true,
                                'showCloseButton': true,
                                'onClosed': function () {
                                    WebUIShopNavEngine.LoadingMSGHide();
                                }
                            }
                  );
              },
              GALastFilterClicked: function (PropID, DeepID, Value) {
                  var ga_SEO = null;
                  if (PropID && DeepID && Value) {
                      var ga_SEO = window.location.protocol + '//' + window.location.hostname + $("#" + PropID + DeepID + Value).attr("href");
                  }
                  return ga_SEO;
              },
              GARegister: function (Type, Args) {
                  try {
                      switch (Type) {
                          case enmGAAsyncCalls.SEOPartial:
                              if (!$.isArray(Args) && Args != null) {
                                  var url = Args;
                                  if (_gaq) {
                                      _gaq.push(['_link', url]);
                                  } else if (pageTracker) {
                                      pageTracker._link(url);
                                  }
                              }
                              break;
                          case enmGAAsyncCalls.SEOTotal:
                              if (_gaq) {
                                  _gaq.push(['_trackPageview']);
                              } else if (pageTracker) {
                                  pageTracker._trackPageview();
                              }
                              break;
                          case enmGAAsyncCalls.Events:
                              if ($.isArray(Args)) {
                                  var category = Args[0]; // Event name
                                  var action = Args[1]; // Specific action name
                                  var label = (Args.length > 2) ? Args[2] : null; // Label
                                  var value = (Args.length > 3) ? Args[3] : null; // Value
                                  if (_gaq) {
                                      _gaq.push(['_trackEvent', category, action, label, value]);
                                  } else if (pageTracker) {
                                      pageTracker._trackEvent(category, action, label, value);
                                  }
                              }
                              break;
                          default:
                              break;
                      }
                  } catch (err) { }
              },
              RefreshRegister: function (Type, ID, Value, Event, Clean, CallBackFunction) {
                  var strFinalEventName = Event;
                  if (Value != null) {
                      strFinalEventName += Value;
                  }
                  $(ID).bind(strFinalEventName, CallBackFunction); //BIND

                  var arrAux = [Type, ID, Value, strFinalEventName, Clean, CallBackFunction];
                  if (Type == 'Paging') {
                      this._arrFilters.splice(0, 0, arrAux);
                  }
                  else {
                      this._arrFilters[this._arrFilters.length] = arrAux;
                  }
              },
              RefreshDo: function (JsonData) {
                  var parseJSON_ini = new Date().getTime();
                  var arrPropsSel = JsonData.PropsSel;
                  var arrFiltersAct = JsonData.FiltersAct;
                  var strIDFilterCaller = JsonData.IDFilterCaller;
                  var strDeepFilterCaller = JsonData.DeepFilterCaller;
                  var strValFilterCaller = JsonData.ValFilterCaller;
                  var blnItemsOnly = JsonData.ItemsOnly;


                  var QS = $.url();
                  var strHash = QS.fparamget();
                  var blnPageInit = this._PageInit; //SAVE STATE BEFORE ITEMS CHANGE IT
                  if (this._PageInit && strHash != '') {
                      blnPageInit = false;
                      FFAPI.listing.variables.preventMSTrigger = true;
                  } else {
                      FFAPI.listing.variables.preventMSTrigger = false;
                  }
                  //UPDATE VALUE RIGHT AWAY
                  this._PageInit = false;

                  if (!blnPageInit) {
                      try {
                          var Type = enmGAAsyncCalls.Events;
                          var strRes = this.GALastFilterClicked(strIDFilterCaller, strDeepFilterCaller, strValFilterCaller);
                          if (strRes) {
                              this.GARegister(Type, ["FFMULTISELECT", "Last Filter Clicked", strRes]);
                          }
                      } catch (err) { }
                  }

                  if (JsonData.IsLastPage || this._SiteIsVerBR) {
                      $("#dvtViewMoreOn").show();
                      $("#dvtViewMoreOn").html(JsonData.viewMoreOn);
                  } else {
                      $("#dvtViewMoreOn").hide();
                  }

                  var arrPropsSelOut = {};
                  var arrPropsActOut = {}; //{ "FilterVal": FilterVal, "Values": new Array() };

                  //OBTEM OS VALORES DAS PROPS SELECCIONADAS PARA O FILTRO EM QUESTÂO
                  for (var key in arrPropsSel) {
                      var objProp = arrPropsSel[key];
                      var FilterVal = this._QSFilterIdentifier + objProp.Id;
                      if (objProp.DynId > 0) {
                          FilterVal += this._QSFilterKeySeparator + objProp.DynId;
                      }

                      var objAux = arrPropsSelOut[FilterVal];
                      if (objAux == null) {
                          //ADD NEW PROP
                          var myObject = {};
                          myObject[FilterVal] = [];
                          $.extend(arrPropsSelOut, myObject);
                          objAux = arrPropsSelOut[FilterVal];
                      }

                      if ($.inArray(objProp.Value, objAux) == -1) {
                          var PropValue = objProp.Value;
                          if (objProp.ValueGroup > -1) {
                              PropValue = PropValue + this._QSFilterKeySeparator + objProp.ValueGroup;
                          }
                          objAux[objAux.length] = PropValue;
                      }
                  }
                  //UPDATE QS FOR SELECTED ITEMS VALUES FROM SERVER

                  var parseJSON_each = null,
                      Type = null,
                      ID = null,
                      Value = null,
                      Event = null,
                      Clean = null,
                      CallBack = null,
                      objRefresher = null,
                      Data = null,
                      arrAux = null,
                      LoggerSpecificMSG = null;
                  //GO TROUGH ALL REGISTERED OBJECTS LIKE FILTERS
                  for (var i = 0; i < this._arrFilters.length; i++) {
                      parseJSON_each = new Date().getTime();
                      try {
                          Data = null;
                          arrAux = this._arrFilters[i];
                          LoggerSpecificMSG = '';

                          Type = arrAux[0];
                          ID = arrAux[1];
                          Value = arrAux[2];
                          Event = arrAux[3];
                          Clean = arrAux[4];
                          CallBack = arrAux[5];
                          objRefresher = $(ID);

                          if (Clean) {
                              if (objRefresher.length) {
                                  objRefresher[0].innerHTML = "";
                              }
                          }
                          if (Type == 'Filter') {
                              if (blnItemsOnly || blnPageInit) {
                                  Data = null;
                              } else {
                                  var strIDFilterCaller = "";

                                  var FilterDyn = 0;
                                  var FilterTypeOrig = Value.split(this._QSFilterIdentifier)[1].split(this._QSFilterIdentifierDeep)[0];
                                  var FilterType = FilterTypeOrig;
                                  //Check for Dynamic Values
                                  if (FilterTypeOrig.split(this._QSFilterKeySeparator).length > 1) {
                                      FilterType = FilterTypeOrig.split(this._QSFilterKeySeparator)[0];
                                      FilterDyn = FilterTypeOrig.split(this._QSFilterKeySeparator)[1];
                                  }

                                  var FilterDeep = Value.split(this._QSFilterIdentifier)[1].split(this._QSFilterIdentifierDeep)[1];
                                  var FilterVal = this._QSFilterIdentifier + Value.split(this._QSFilterIdentifier)[1].split(this._QSFilterIdentifierDeep)[0];
                                  LoggerSpecificMSG = ' ID={' + FilterVal + '}';
                                  var arrSelAux = arrPropsSelOut[FilterVal];
                                  if (arrSelAux == null) {
                                      arrSelAux = [];
                                  }

                                  //var arrActAux = eval('arrPropsActOut.' + FilterVal);
                                  var arrActAux = arrFiltersAct.filter(function (element, index, array) {
                                      return ((element.Type == FilterType) && (element.Deep == FilterDeep) && (element.Dynamic == FilterDyn));
                                  });

                                  if (arrActAux.length == 1) {
                                      //EXCEPTION NOT TO BREAK ALL UI LOGIC CHANGE TO GET GROUP ID INTO KEY COMPOSITION ON UI
                                      //Check if we have Group inside The Filter
                                      if (arrActAux[0].Values[0].Group > 0) {
                                          for (var k = 0; k < arrActAux[0].Values.length; k++) {
                                              arrActAux[0].Values[k].Val += this._QSFilterKeySeparator + arrActAux[0].Values[k].Group;
                                          }
                                      }
                                      //EXCEPTION NOT TO BREAK ALL UI LOGIC CHANGE TO GET GROUP ID INTO KEY COMPOSITION ON UI
                                      arrActAux = arrActAux[0].Values;
                                  } 

                                  //PREPARE DATA TO FILTER REFRESH EVENT
                                  strIDFilterCaller = JsonData.IDFilterCaller;
                                  Data = { "FilterID": FilterVal, "PropsSel": arrSelAux, "PropsAct": arrActAux, "IDFilterCaller": strIDFilterCaller };
                              }
                          } else if (Type == 'Item') {
                              Data = null;
                              if (blnPageInit == false) {
                                  if (JsonData.Message.MSGError) {
                                      Data = { "error": true };
                                  } else {
                                      Data = { "products": JsonData.Items, "CategoryName": JsonData.CategoryName, "TotalItems": JsonData.TotalItems, "ItemsFoundStr": JsonData.ItemsFoundStr };
                                  }
                              }
                              //TEMP TODO -> DELETE AFTER SOLVE LOAD ON SERVER ISSUE
                              Data = { "products": JsonData.Items, "CategoryName": JsonData.CategoryName, "TotalItems": JsonData.TotalItems, "ItemsFoundStr": JsonData.ItemsFoundStr };
                              //TEMP TODO -> DELETE AFTER SOLVE LOAD ON SERVER ISSUE
                          } else if (Type == 'Paging') {
                              Data = [];
                              if (
                                  typeof (JsonData.PagingPages) !== "undefined" &&
                                  typeof (JsonData.PagingViews) !== "undefined" &&
                                  typeof (JsonData.PagingData) !== "undefined") {

                                  //UPDATE QS FOR PAGING VALUES FROM SERVER
                                  this.QSPagingSelectorSet(JsonData.PagingData.ps);
                                  this.QSPagingViewSet(JsonData.PagingData.pv);
                                  JsonData.PagingData["it"] = JsonData.ItemsFoundStr;

                                  Data = [{ "Pages": JsonData.PagingPages, "Views": JsonData.PagingViews, "PagingData": JsonData.PagingData }];
                              }
                          } else if (Type == 'Order') {
                              Data = [];
                              if (typeof (JsonData.Order) !== "undefined") {
                                  Data = JsonData.Order;
                                  this.QSOrderTypeSet(parseInt(Data.oby));
                              }
                          }

                          //alert('LAUNCH TRIGGER');
                          //LAUNCH TRIGGER
                          if (Data) {
                              objRefresher.trigger(Event, Data);
                          }
                          //alert('TRIGGER LAUNCHED');
                      } catch (err) { }
                  }

                  if ($(".FilterClearLink:visible").length) { // If any clear is visible
                      $('.FilterClearAllLink').show();
                  } else {
                      $('.FilterClearAllLink').hide();
                  }
                  this.LoadingMSGHide();
              },
              QSCleaner: function () {
                  if (this._QSCleanerProps) {
                      //CLEAN PROPS OUTSIDE SHOPNAV RANGE OF PROPS
                  }
                  if (this._QSCleanerValues) {
                      //CLEAN VALUES OUTSIDE SHOPNAV RANGE OF VALUES VALIDATION
                  }
              },
              QSFilterLastSelGet: function () {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSFilterLastSel);
              },
              QSFilterLastSelSet: function (PropID, PropDeep) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSFilterLastSel, PropID);
                  this.SetHash(QS.fparamget());
              },
              QSPagingSelectorGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSPagingSelectorIdentifier);
              },
              QSPagingSelectorSet: function (Val) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSPagingSelectorIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              QSPagingViewGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSPagingViewIdentifier);
              },
              QSPagingViewSet: function (Val) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSPagingViewIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              QSPagingGoToGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSPagingGoToIdentifier);
              },
              QSPagingGoToSet: function (Val) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSPagingGoToIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              QSPriceGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  var ValAux = $.url().fparam(this._QSPriceIdentifier);

                  var arrVal = [0, 0];
                  if (ValAux) {
                      //CALCULATE MIN AND MAX SEPARATION
                      arrVal = ValAux.split(this._QSPriceValueSeparator);
                  }

                  return arrVal;
              },
              QSPriceSet: function (ValMin, ValMax) {
                  if (ValMin == '') {
                      ValMin = 0;
                  }
                  if (ValMax == '') {
                      ValMax = 0;
                  }
                  var Val = '';

                  if (ValMax > 0 || ValMin > 0) {
                      Val = ValMin + this._QSPriceValueSeparator + ValMax;
                  }

                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSPriceIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              QSOrderTypeGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSOrderTypeIdentifier);
              },
              QSOrderTypeSet: function (Val) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSOrderTypeIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              QSChangeSelect: function (ID, Deep, Val, IsSelected) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //OBTEM O PARAMETRO HASH PARA A PROP
                  var strHashID = this._QSFilterIdentifier + ID + this._QSFilterIdentifierDeep + Deep;
                  var HashProp = QS.fparam(strHashID);
                  var HashPropNew = '';

                  if (HashProp === undefined) {
                      //ADICIONA A PROP COM O VALUE IF IT IS A SELECTION
                      if (IsSelected == true) {
                          HashPropNew = Val;
                      }
                  } else {
                      //VERIFICA SE TEM A PROP VALUE
                      //Parse do valor interior
                      var arrPropValues = new Array();
                      arrPropValues = HashProp.split(this._QSFilterValueSeparator);
                      var intIndexElem = $.inArray(Val, arrPropValues);
                      if (intIndexElem == -1) {
                          //NOT FOUND TRY NEGATIVE
                          /**************** PARSEINT ****************/
                          intIndexElem = $.inArray((parseInt(Val) * -1) + '', arrPropValues);
                          /**************** PARSEINT ****************/
                      }

                      if (intIndexElem > -1) {
                          //REMOVE IF EXISTS AND IF IS A DESELECTION
                          if (IsSelected == false) {
                              //REMOVE!!!!!!
                              arrPropValues.splice(intIndexElem, 1);
                          }
                      } else {
                          //ADD IF NOT EXISTS AND IF IS A SELECTION
                          if (IsSelected == true) {
                              //ADD!!!!
                              arrPropValues[arrPropValues.length] = Val;
                          }
                      }
                      arrPropValues = arrPropValues.sort();

                      //BUILD NEW QS FROM ARRAY
                      HashPropNew = arrPropValues.join(this._QSFilterValueSeparator);
                  }

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(strHashID, HashPropNew);

                  this.SetHash(QS.fparamget());
              },
              QSSelectedBlockedSet: function (ID, Deep, Val, IsBlocked) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD

                  //** PREPARE VALUES
                  var arrJsonID = [Val];
                  if (Val.indexOf(this._QSFilterKeySeparator) != -1) {
                      arrJsonID = Val.split(this._QSFilterKeySeparator);
                  }
                  /**************** PARSEINT ****************/
                  var intValNeg = parseInt(arrJsonID[0]) * -1;
                  /**************** PARSEINT ****************/
                  var intValNegFinal = intValNeg;
                  if (arrJsonID.length == 2) {
                      intValNegFinal += this._QSFilterKeySeparator + arrJsonID[1];
                  }
                  //** PREPARE VALUES

                  //** GET QS VALUES
                  var QS = $.url();

                  //OBTEM O PARAMETRO HASH PARA A PROP
                  var strHashID = this._QSFilterIdentifier + ID + this._QSFilterIdentifierDeep + Deep;
                  var HashProp = QS.fparam(strHashID);
                  var HashPropNew = '';

                  if (HashProp === undefined) {
                      //ADICIONA A PROP COM O NEGATIVE VALUE IF IT IS A SELECTION
                      if (IsBlocked) {
                          HashPropNew = intValNegFinal;
                      }
                  } else {
                      //VERIFICA SE TEM A PROP VALUE
                      //Parse do valor interior
                      var arrPropValues = new Array();
                      arrPropValues = HashProp.split(this._QSFilterValueSeparator);

                      //IF EXISTS AND IS POSITIVE THEN REMOVE SO IT CAN BE CHANGED TO NEGATIVE
                      var intIndexElem = $.inArray(Val, arrPropValues);
                      if (intIndexElem != -1) {
                          //FOUND POSITIVE VALUE (selected)
                          if (IsBlocked == true) {
                              //BLOCK
                              //REMOVE POSITIVE VALUE
                              arrPropValues.splice(intIndexElem, 1);
                              //ADD NEGATIVE
                              arrPropValues[arrPropValues.length] = intValNegFinal.toString();
                          }
                      }
                      else {
                          //NOT FOUND TRY FOUND NEGATIVE
                          intIndexElem = $.inArray(intValNegFinal.toString(), arrPropValues);
                          if (intIndexElem != -1) {
                              //FOUND NEGATIVE VALUE (selected+blocked)
                              if (IsBlocked == false) {
                                  //UNBLOCK
                                  //REMOVE NEGATIVE VALUE
                                  arrPropValues.splice(intIndexElem, 1);
                                  //ADD POSITIVE
                                  arrPropValues[arrPropValues.length] = Val;
                              }
                          }
                      }

                      //BUILD NEW QS FROM ARRAY
                      HashPropNew = arrPropValues.join(this._QSFilterValueSeparator);
                  }

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(strHashID, HashPropNew);

                  this.SetHash(QS.fparamget());
              },
              UIBlockedSet: function (FullFilterID, Block, BlockedOnBottom, listSel) {
                  var newDate = new Date().getTime();
                  var $objAux = FullFilterID;
                  var ID = null;
                  if (typeof (FullFilterID) == "string") {
                      ID = FullFilterID;
                      $objAux = $(FullFilterID);
                  }
                  if (Block) {
                      $objAux.closest('li').addClass("blocked");
                      $objAux.addClass("blocked");
                      $objAux.parent().addClass("label-check-disabled");
                      $objAux.find('input').attr('disabled', 'disabled');
                      //IF WE HAVE AN ID
                      if (ID != null) {
                          var $elemClone = $(ID + "_cloned");
                          if ($elemClone.length > 0) {
                              $elemClone.addClass("blocked");
                          }
                      }
                      if (BlockedOnBottom) {
                          $objAux.not(".active").parent().addClass("blockedOnBottom");
                          if (ID != null) {
                              $(ID + "_blocked").parent().removeClass("blockedOnBottom");
                              $elemClone.show();
                          } else {
                              $("#FilterList" + listSel + "_blocked > li").removeClass("blockedOnBottom");
                          }
                      }
                  }
                  else {
                      $objAux.closest('li').removeClass("blocked").show();
                      $objAux.removeClass("blocked").show();
                      $objAux.parent().removeClass("label-check-disabled");
                      $objAux.find('input').removeAttr('disabled');
                      //IF WE HAVE AN ID
                      if (ID != null) {
                          var $elemClone = $(ID + "_cloned");
                          if ($elemClone.length > 0) {
                              $elemClone.removeClass("blocked").show();
                          }
                      }
                      if (BlockedOnBottom) {
                          $objAux.not(".active").parent().removeClass("blockedOnBottom");
                          if (ID != null) {
                              $(ID + "_blocked").parent().addClass("blockedOnBottom");
                          } else {
                              $("#FilterList" + listSel + "_blocked > li").addClass("blockedOnBottom");
                          }
                      }
                  }
              },
              UISelectedSet: function (FullFilterID, Select) {
                  var $objAux = FullFilterID;
                  var ID = null;
                  if (typeof (FullFilterID) == "string") {
                      ID = FullFilterID;
                      $objAux = $(FullFilterID);
                      // trying to retrieve object from full filter list
                      if ($objAux.length == 0) {
                          var aux = FullFilterID.split("#")[1];
                          var filterVal = "#FilterPopUpListItemLink" + aux;
                          var obj = $(filterVal);
                          if (obj.length > 0) {
                              var funcName = "FFAPI.listing.methods.copyTopFilterToList" + aux.split(this._QSFilterValueIdentifier)[0];
                              $objAux = eval(funcName + "(obj);");
                          }
                      }
                  }
                  var span = $objAux.find('span');
                  var input = $objAux.find('input');
                  if (Select) {
                      $objAux.addClass("active");                      
                      if (span.hasClass('ms-drop-option')) {
                          span.closest('li').addClass('ms-drop-selected');
                      }
                      else if (span.hasClass('icon-box-unchecked')) {
                          span.removeClass('icon-box-unchecked').addClass('glyphs icon-box-checked');
                      }
                      if ($objAux.data('filter') != undefined) {
                        //Enable Clear buttons
                        $('#FilterClearf' + $objAux.data('filter').f + 'd' + $objAux.data('filter').d).removeClass('hide');
                        $('.FilterClearAllLink').removeClass('hide');
                      }
                      //IF WE HAVE AN ID
                      if (ID != null) {
                          if ($(ID + "_cloned").length > 0) {
                              $(ID + "_cloned").addClass("active");
                          }
                      }
                  }
                  else {
                      $objAux.removeClass("active");
                      if (span.hasClass('ms-drop-option')) {
                          span.closest('li').removeClass('ms-drop-selected')
                      } else if (span.hasClass('icon-box-checked')) {
                          span.addClass('icon-box-unchecked').removeClass('glyphs icon-box-checked')
                      }
                      //IF WE HAVE AN ID
                      if (ID != null) {
                          if ($(ID + "_cloned").length > 0) {
                              $(ID + "_cloned").removeClass("active");
                          }
                      }
                  }
                  if (input.length > 0) {
                      input.prop('checked', Select);
                  }
              },
              PageLoadingSet: function (isLoading) {
                  this._PageLoading = isLoading;
              },
              PageLoadingGet: function () {
                  return this._PageLoading;
              },
              PageInitSet: function (Val) {
                  this._PageInit = Val;
              },
              PageInitGet: function () {
                  return this._PageInit;
              },
              QSPagingTypeGet: function () {
                  //USED BY PAGING TO MANAGE QS AND THEN USE PAGE LOAD
                  return $.url().fparam(this._QSPagingViewIdentifier);
              },
              QSPagingTypeSet: function (Val) {
                  //USED BY FILTERS TO MANAGE QS AND THEN USE PAGE LOAD
                  var QS = $.url();

                  //ADICIONA A PROP COM O VALUE
                  QS.fparamset(this._QSPagingViewIdentifier, Val);

                  this.SetHash(QS.fparamget());
              },
              SetTranslationTerms: function (object) {
                  this._TranslationTerms = object;
              },
              GetTranslationTerm: function (str, strDefault) {
                  try {
                      var res = this._TranslationTerms[str];
                      if (!res) {
                          res = strDefault;
                      }
                  } catch (err) { }
                  return res;
              },
              PagingGet: function (PagingSelectorItem, PagingViewItem, ItemGoTo) {
                  this.QSPagingSelectorSet(PagingSelectorItem);
                  this.QSPagingViewSet(PagingViewItem);
                  if (ItemGoTo) {
                      this.QSPagingGoToSet(ItemGoTo);
                  }
                  this.PageLoad(null, null, null, true);
              },
              OrderGet: function (OrderValue) {
                  this.QSOrderTypeSet(OrderValue);
                  this.PageLoad(null, null, null, true);
              },
              FilterGet: function (PropID, PropDeep, PropVal, IsSelected) {
                  this.QSChangeSelect(PropID, PropDeep, PropVal, IsSelected);
                  this.PageLoad(PropID, PropDeep, PropVal, false);
              },
              GetContentVersion: function () {
                  return this._ContentVersion;
              },
              PageLoad: function (PropID, PropDeep, PropVal, OnlyItems) {
                  var QS = $.url();
                  var strHash = QS.fparamget();
                  var xhr;

                  this.LoadingMSGShow();
                  //CALLED TO REFRESH DATA
                  //BEFORE ANY CALL TO SERVER CLEAN QS
                  this.QSCleaner();

                  var PagingSelector = this.QSPagingSelectorGet();
                  var PagingView = this.QSPagingViewGet();
                  var OrderBy = this.QSOrderTypeGet();

                  if (!this._OnlyItemsOn) {
                      OnlyItems = false;
                  }

                  //ABORT PREVIOUS ASYNC CALLS
                  for (i = 0; i <= this._arrAjaxGetData.length; i++) {
                      xhr = this._arrAjaxGetData[i];
                      if (xhr != null && xhr !== 'undefined') {
                          xhr.abort();
                      }
                  }
                  this._arrAjaxGetData = [];
                  //ABORT PREVIOUS ASYNC CALLS

                  var strURL = window.href;

                  xhr = this.GetDataItems(strHash, PropID, PropDeep, PropVal, PagingSelector, PagingView, OrderBy, strURL, OnlyItems);
                  this._arrAjaxGetData[this._arrAjaxGetData.length] = xhr;

              },
              SetHash: function (hash) {
                  //window.location.hash = hash;
                  window.location.replace(('' + window.location).split('#')[0] + '#' + hash);
              },
              GetDataItems: function (strQS, IDFilterCaller, DeepFilterCaller, ValFilterCaller, PagingSelector, PagingView, OrderBy, strURL, OnlyItems) {
                  if (typeof (strURL) == "undefined" || (typeof (strURL) == "string" && strURL == "")) {
                      strURL = location.href;
                  }
                  if (IDFilterCaller == null) {
                      IDFilterCaller = this.QSFilterLastSelGet();
                      if (IDFilterCaller == null) {
                          IDFilterCaller = 0;
                      }
                  }
                  if (DeepFilterCaller == null) {
                      DeepFilterCaller = 0;
                  }
                  if (ValFilterCaller == null) {
                      ValFilterCaller = 0;
                  }
                  if (PagingSelector == null) {
                      PagingSelector = 0;
                  }
                  if (PagingView == null) {
                      PagingView = 0;
                  }
                  if (OrderBy == null) {
                      OrderBy = 0;
                  }

                  //IF WE HAVE A LOADING WITH CLEAN HASH THEN WE DO NOT CALL PAGE LOAD
                  var QS = $.url();
                  var strHash = QS.fparamget();
                  if (this._PageInit && strHash == '') {
                      if (typeof (FFAPI.listing.variables.hidJsonData) != "undefined") {
                          WebUIShopNavEngine.RefreshDo(FFAPI.listing.variables.hidJsonData); //SIMULATE CALLBACK SO WE CAN BIND TRIGGERS
                          return null;
                      }
                  }

                  return $.ajax({
                      url: window.universal_variable.page.subfolder + "/FFAPI/MultiSelect.asmx/GetDataItems",
                      type: "POST",
                      dataType: "json",
                      contentType: "application/json; charset=utf-8",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
                      },
                      data: '{' +
                        'URL: "' + encodeURIComponent(strURL) + '", ' +
                        'QueryString: "' + strQS + '", ' +
                        'IDFilterCaller: "' + IDFilterCaller + '", ' +
                        'DeepFilterCaller: "' + DeepFilterCaller + '", ' +
                        'ValFilterCaller: "' + ValFilterCaller + '", ' +
                        'PagingSelector: "' + PagingSelector + '", ' +
                        'PagingView: "' + PagingView + '", ' +
                        'OrderBy: "' + OrderBy + '", ' +
                        'OnlyItems: "' + OnlyItems + '"' +
                      '}',
                      success: function (msg) {
                          var Json = msg;
                          if (msg.hasOwnProperty('d'))
                              Json = msg.d;
                          if (Json) {
                              WebUIShopNavEngine.RefreshDo(Json);
                          }
                      },
                      error: function (e) {
                          if (e.statusText && e.statusText != 'abort') {
                              WebUIShopNavEngine.LoadingMSGHide();
                          }
                      }
                  });
              }
              //LAST METHOD WITHOUT COMMA
          },
        {
            // ********************* PROPERTIES *********************
            getset: [
                        ['QSFilterIdentifier', '_QSFilterIdentifier'],
                        ['QSFilterSeparator', '_QSFilterSeparator'],
                        ['QSFilterIdentifierDeep', '_QSFilterIdentifierDeep'],
                        ['QSFilterValueSeparator', '_QSFilterValueSeparator'],
                        ['QSFilterKeySeparator', '_QSFilterKeySeparator'],
                        ['QSFilterLastSel', '_QSFilterLastSel'],
                        ['QSCleanerProps', '_QSCleanerProps'],
                        ['QSCleanerValues', '_QSCleanerValues'],
                        ['QSPagingSelectorIdentifier', '_QSPagingSelectorIdentifier'],
                        ['QSPagingViewIdentifier', '_QSPagingViewIdentifier'],
                        ['QSPagingTotalIdentifier', '_QSPagingTotalIdentifier'],
                        ['QSPagingTypeIdentifier', '_QSPagingTypeIdentifier'],
                        ['QSOrderTypeIdentifier', '_QSOrderTypeIdentifier'],
                        ['GASpecificCode', '_GASpecificCode'],
                        ['GAAltTracker', '_GAAltTracker'],
                        ['QSPriceIdentifier', '_QSPriceIdentifier'],
                        ['QSPriceValueSeparator', '_QSPriceValueSeparator'],
                        ['OnlyItemsOn', '_OnlyItemsOn'],
                        ['ContentVersion', '_ContentVersion']
            ],

            // ********************* SETTINGS *********************
            abstract: false
        });
