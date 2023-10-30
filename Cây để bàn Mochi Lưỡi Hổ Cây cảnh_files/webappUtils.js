const SHOPPING_CART="__sc";var shoppingCart={orderId:0,vat:0,fee:0,discount:0,DataItems:[],};function getCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')
c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)
return c.substring(nameEQ.length,c.length);}
return null;}
function setCookie(name,value,days){var expires="";if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toUTCString();}
document.cookie=name+"="+(value||"")+expires+"; path=/";}
function eraseCookie(name){document.cookie=name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';}
function formatMoney(n,c,d,t){var s=n<0?"-":"",i=String(parseInt(n=Math.abs(Number(n)||0).toFixed(c))),j=(j=i.length)>3?j%3:0;var st=s+(j?i.substr(0,j)+t:"")+i.substr(j).replace(/(\d{3})(?=\d)/g,"$1"+t)+(c?d+Math.abs(n-i).toFixed(c).slice(2):"");return LANGUAGE=="vn"?st+" đ":"$"+st;}
function GetShoppingCart(){var sc=getCookie(SHOPPING_CART);shoppingCart=sc==null?{orderId:0,vat:10,fee:0,discount:0,DataItems:[]}:JSON.parse(sc);RefreshCart();}
function RefreshCart(){if(_.isNull(shoppingCart)||_.size(shoppingCart.DataItems)==0)
return;var total=_.size(shoppingCart.DataItems);$("#shopping-cart strong").html(CART+"<span> ("+total+")</span>");if(total>0)
$('#shopping-cart').attr("href",scUrl);else
$('#shopping-cart').attr("href","javascript:void(0)");}
function SetShoppingCart(){if(_.isNull(shoppingCart)||_.isNull(shoppingCart.DataItems)||shoppingCart.DataItems.length===0){eraseCookie(SHOPPING_CART);window.location.replace("/checkout/EmptyCart.aspx?lang="+LANGUAGE);}
setTimeout(function(){setCookie(SHOPPING_CART,JSON.stringify(shoppingCart),1);RefreshCart();UpdateTotal();},50);}
function RemoveItem(id){var sp=_.reject(shoppingCart.DataItems,function(item){if(item.id===id){var elem=$('#sc-item .cart-item[data-id="'+item.id+'"]');if(!_.isUndefined(elem)&&!_.isNull(elem))
$(elem).remove();return true;}
else return false;});shoppingCart.DataItems=sp;SetShoppingCart();}
function UpdateTotal(){var subtotal=0;_.each(shoppingCart.DataItems,function(item){var qty=_.isNull(item)?0:item.qty;var unitPrice=_.isNull(item)?0:item.unitPrice;subtotal+=(qty*unitPrice);});var decimalDigits=LANGUAGE=="vn"?0:2;var decimalSeparator=LANGUAGE=="vn"?",":"."
var groupSeparator=LANGUAGE=="vn"?".":","
if(subtotal>0)
$("#subtotal").html(formatMoney(GetCurrency(subtotal),decimalDigits,decimalSeparator,groupSeparator));else
$("#subtotal").html("-");if(shoppingCart.fee>0)
$("#sub-fee").html(formatMoney(GetCurrency(shoppingCart.fee),decimalDigits,decimalSeparator,groupSeparator));else
$("#sub-fee").html("-")
if(shoppingCart.discount>0)
$("#discount").html(formatMoney(GetCurrency(shoppingCart.discount),decimalDigits,decimalSeparator,groupSeparator));else
$("#discount").html("-");var temp=subtotal+shoppingCart.fee-shoppingCart.discount;var total=temp*(1+shoppingCart.vat/100);if(total>0)
$("#total").html(formatMoney(GetCurrency(total),decimalDigits,decimalSeparator,groupSeparator));else
$("#total").html("-");var vatAmount=shoppingCart.vat==0?0:total-temp;if(vatAmount>0)
$("#vat").html(formatMoney(GetCurrency(vatAmount),decimalDigits,decimalSeparator,groupSeparator));else
$("#vat").html("-");}
function AddShoppingCart(ctrl,id,price){var cartItems=shoppingCart.DataItems;var hasItems=_.some(cartItems,function(item){return item.id==id});if(!hasItems){var item={qty:1,id:id,unitPrice:price,};shoppingCart.DataItems.push(item);SetShoppingCart();$(ctrl).html(ALREADY_IN_CART);$(ctrl).addClass("on-hand");}}
function AddOrRemoveItems(ctrl,isPlus,id,price){var input=isPlus?$(ctrl).prev():$(ctrl).next();var value=parseInt($(input).val());if(isPlus)
value=_.isNaN(value)||_.isNull(value)?1:value+1;else
value=_.isNaN(value)||_.isNull(value)||value<=0?0:value-1;$(input).val(value);AddCart(input,id,price);}
function HandleKeypress(ctrl,evt,id,price){AddCart(ctrl,id,price);if(evt.keyCode===13){evt.preventDefault();}}
function AddCart(ctrl,id,price){var parent=$(ctrl).parents(".cart-item");if(_.isUndefined(parent)||_.isNull(parent))
return;var qty=parseInt($(parent).find(".txtQty").val());var cartItems=shoppingCart.DataItems;var hasItems=_.some(cartItems,function(item){return item.id==id});if(_.isNaN(qty)||qty<=0){if(hasItems===true)
RemoveItem(id);}
else{if(hasItems===true){_.each(cartItems,function(item){if(item.id===id){item.qty=qty;}});}
else{var item={qty:qty,id:id,unitPrice:price,};shoppingCart.DataItems.push(item);}}
SetShoppingCart();}
function GetCurrency(value){return LANGUAGE=="vn"?value:value/RATE;}
function ChangeState(ctrl,id){var checked=$(ctrl).is(':checked');if(checked)
ids.push(id);else{ids=_.reject(ids,function(item){return item===id});}
pIndex=0;$('#data_items').html("");LoadItems();}
function SortOrder(ctrl,value){$("ul.df-menu a").removeClass("active");$(ctrl).addClass("active");orderBy=value;pIndex=0;$('#data_items').html("");LoadItems();}
function RemoveId(id){ids=_.reject(ids,function(item){return item===id});var cck=$(".ctrl-filter input[data-id="+id+"]");$(cck).prop('checked',false);pIndex=0;$('#data_items').html("");LoadItems();}
function LoadItems(){var re=typeof(refix)==="undefined"?"":refix;var dataRequest={pageNumber:pIndex,ids:ids,orderBy:orderBy,groupId:groupId,rangePrice:rangePrice,refix:re};setTimeout(function(){cbkMaster.PerformCallback("GET_ITEMS_"+JSON.stringify(dataRequest));},10);}
function LinkMore(ctrl){$(ctrl).remove();$(".div-more").remove();LoadItems();}
function SearchAdvanced(){var price=$("#ddlPrice").val();var occasion=$("#ddlOccasion").val();var pre=LANGUAGE=="en"?"/en":""
window.location.replace(pre+occasion+".aspx?price="+price);}
function ToggleMenu(){$(".left-menu").css("width","250px");$("#content").prepend('<div class="modal-overlay"></div>');$(".modal-overlay").click(function(){CloseNav();});}
function CloseNav(){$(".left-menu").css("width","0px");$(".modal-overlay").remove();}
function ChangePrice(ctrl,range){$(".range-price a").each(function(){$(this).removeClass("active");});$(ctrl).addClass("active");rangePrice=range;$("#low-price").val("");$("#high-price").val("");pIndex=0;$('#data_items').html("");LoadItems();}
function RemovePrice(){$(".range-price a").each(function(){$(this).removeClass("active");});$("#low-price").val("");$("#high-price").val("");rangePrice="0";pIndex=0;$('#data_items').html("");LoadItems();}
function SetPrice(){var lowPrice=parseFloat($("#low-price").val());var highPrice=parseFloat($("#high-price").val());rangePrice=highPrice<lowPrice?highPrice+"-"+lowPrice:lowPrice+"-"+highPrice;pIndex=0;$('#data_items').html("");LoadItems();}
function HandleSetPrice(evt){if(evt.keyCode===13){SetPrice();evt.preventDefault();}}
Handlebars.registerHelper("price",function(lang,VNPrice,ENPrice,oldPrice){if(lang==="vn"){return oldPrice!="0"?"<span class='vn'><em class='oprice'>"+oldPrice+"</em><em>"+VNPrice+"</em></span>":"<span class='vn'>"+VNPrice+"</span>";}
else return "<span class='vn'>"+VNPrice+"</span><span class='en'>"+ENPrice+"</span>";});Handlebars.registerHelper("new_item",function(isNew){return isNew===true?"<span class='ibadge inew'></span>":"";});Handlebars.registerHelper("promotion",function(isPromotion){return isPromotion===true?"<span class='ibadge isale'>Sale</span>":"";});Handlebars.registerHelper("freeship",function(hasShippingCost){return!hasShippingCost===true?"<span class='ibadge freeship'>Freeship</span>":"";});function SelectText(nodeId){const node=document.getElementById(nodeId);if(document.body.createTextRange){const range=document.body.createTextRange();range.moveToElementText(node);range.select();document.execCommand("copy");}else if(window.getSelection){const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(node);selection.removeAllRanges();selection.addRange(range);document.execCommand("copy");}else{console.warn("Could not select text in node: Unsupported browser.");}}