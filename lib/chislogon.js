(function() {
  'use strict';
  var split3 = function(x, a) {
    /*Принимает строку с цифрами без дробной части, 
    возвращает массив строк из 3 цифр, отсекаемых начиная с конца (в порядке отсечения)*/
    if (!a) a = [];
    if (x === "" || !/\d{1,3}$/g.test(x)) return a;
    return split3(x.replace(/\d{1,3}$/g, function(m) {
      a.push(m);
      return ""
    }), a)
  };
	var format=function(num, options){
  //options={
  //locales:options.locales||"ru-ru",
  //style:options.style||"decimal",/*"currency", "percent"*/
  //currency:options.currency||"RUB",
  //currencyDisplay:options.currencyDisplay||"symbol",/*,"code","name"*/
  //};
  var x=new Intl.NumberFormat("ru-ru",{style: "currency",
    currency: "RUB"});
  console.log(x.resolvedOptions ());
  return x.format(num)
  };
  var razryad = function(snum, unit, zero) {
    /*Принимает строку из snum 3-х цифр, возвращает сцепку из прописных цифр и одним из вариантов ед. изм. в unit
    Если содержит только нули, то установкой zero=true - показывать ед.изм., а zero="ноль ед.изм" - свой вариант*/
    unit = unit || ["m", "", "", ""];
    snum = {
      0: "000",
      1: "00",
      2: "0",
      3: ""
    }[snum.length] + snum; /*Фиксация формата*/
    if (/^0{3}$/.test(snum)) {
      return zero ? (zero == true ? unit[3] : zero) : ""
    }; //Обработка zero
    var odin = {
      "m": "один",
      "f": "одна",
      "n": "одно"
    }[unit[0]] || "один";
    var dva = {
      "m": "два",
      "f": "две",
      "n": "два"
    }[unit[0]] || "два";
    var h100 = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
    var h010 = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    var h011 = ["", odin, dva, "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать",
      "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"
    ];
    return snum.replace(/^([0-9])(?:(1[0-9])|(?:([02-9])([0-9])))$/g, function(m, s100, d011, d010, e011) {
      var form = +e011;
      var u = (form > 4 || !form) ? unit[3] : (form > 1 && form < 5) ? unit[2] : unit[1];
      return [h100[s100], h011[d011], h010[d010], h011[e011], u].filter(function(x) {return x?true:false}).join(' ')
    })
  };

  var common = function(number, unit, zero, ondig) {
    /*Принимает строку из snum 18-х цифр, возвращает сцепку из прописных цифр и одним из вариантов ед. изм. в unit
	  Если snum содержит только нули, то установкой zero=true - показывать ед.изм., а zero="ноль ед.изм" - свой вариант*/
    unit = unit || ["m", "", "", ""];
    number = number || "";
    if (/^0+$/.test(number)) {
      return zero ? (zero == true ? (ondig?"0 ":"ноль ")+unit[3]: zero) : ""
    };
    var n = split3(number);
    var units = [unit, ["f", "тысяча", "тысячи", "тысяч"],
      ["m", "миллион", "миллиона", "миллионов"],
      ["m", "миллиард", "миллиарда", "миллиардов"],
      ["m", "триллион", "триллиона", "триллионов"],
      ["m", "квадриллион", "квадриллиона", "квадриллионов"]
    ];
    if (ondig||n.length > units.length) {
    	var form=(number.slice(-2,-1))<2?+number.slice(-2):+number.slice(-1);
    	var u = (form > 4 || !form) ? unit[3] : (form > 1 && form < 5) ? unit[2] : unit[1];
      number=number.replace(/^0+/g,"");
    	return number?number+" "+u:""
      };
    for (var i = 0; i < units.length; i++) {
      units[i] = n[i] ? razryad(n[i], units[i], i == 0) : ""
    };
    return units.reverse().filter(function(x) {return x?true:false}).join(' ').trim();
  };

  var dolya = function(dotnum) {
    var wrd = ["десят", "сот", "тысячн", "десятитысячн", "стотысячн",
      "миллионн", "десятимиллионн", "стомиллионн",
      "миллиардн", "десятимиллиардн", "стомиллиардн",
      "триллионн", "десятитриллионн", "стотриллионн",
      "квадриллионн", "десятиквадриллионн", "стоквадриллионн"
    ][dotnum.length - 1];
    return ["f", wrd + "ая", wrd + "ых", wrd + "ых"]
  };

  var decimal = function(snum, options) {
  	options=options?options:{};
  	options['off_base']=('off_base' in options)?options['off_base']:false;
    options['off_part']=('off_part' in options)?options['off_part']:false;
    options['zero_base']=('zero_base' in options)?options['zero_base']:false;
    options['zero_part']=('zero_part' in options)?options['zero_part']:false;
    var tnum = snum.split(",").join(".").split(".");
    tnum[0] = common(tnum[0], (tnum[1] ? ["f", "целая", "целых", "целых"] : false), options.zero_base, options.off_base);
    tnum[1] = tnum[1] ? common(tnum[1], dolya(tnum[1]), options.zero_part, options.off_part) : "";
    tnum = tnum.join(" ");
    return tnum
  };

  var currency = function(summa, options) {
    var units = {
      RUB: {
        base: ['m', 'рубль', 'рубля', 'рублей'],
        part: ['f', 'копейка', 'копейки', 'копеек']
      },
      USD: {
        base: ['m', 'доллар', 'доллара', 'долларов'],
        part: ['m', 'цент', 'цента', 'центов']
      },
      EUR: {
        base: ['m', 'евро', 'евро', 'евро'],
        part: ['m', 'евроцент', 'евроцента', 'евроцентов']
      },
      CNY: {
        base: ['m', 'юань', 'юаня', 'юаней'],
        part: ['m', 'фень', 'феня', 'феней']
      },
      KZT: {
        base: ['m', 'тенге', 'тенге', 'тенге'],
        part: ['f', 'тиын', 'тиына', 'тиынов']
      },
      UAH: {
        base: ['f', 'гривна', 'гривны', 'гривен'],
        part: ['f', 'копейка', 'копейки', 'копеек']
      }
    };
    var dflt_opt= {currency: "RUB", off_base: false, off_part: false, zero_base:true, zero_part:false};
    options=options?options:{};
    for (var key in dflt_opt){
    	options[key]=(key in options)?options[key]:dflt_opt[key]
    };
    options.currency=options.currency.toUpperCase();
    options['unit']=options['unit']?options['unit']:(units[options.currency]||{base: "", part: ""});
    var tnum = parseFloat(summa.split(",").join(".")).toFixed(2).split(".");
    tnum[0] = /\d/.test(tnum[0]) ? common(tnum[0], options.unit.base, options.zero_base, options.off_base) : "";
    tnum[1] = tnum[1] ? common(tnum[1], options.unit.part, options.zero_part, options.off_part) : "";
    tnum = tnum.join(" ");
    return tnum
  };
  var globals = (typeof module !== 'undefined' && module !== null) ? exports : window;

  globals.chislogon = {
    common: common,
    decimal: decimal,
    currency: currency
  };

})();