# Числогон (chislogon)
Конвертер цифровой формы числа в прописную форму числа с поддержкой склонения единиц измерения

## Возможности
* Пропись целых чисел: 230256 =〉двести тридцать тысяч двести пятьдесят шесть
* Пропись дробных чисел: 230256,515 =〉двести тридцать тысяч двести пятьдесят шесть целых пятьсот пятнадцать тысячных
* Пропись денежных сумм: 5,68 =〉пять рублей шестьдесят восемь копеек, 1 доллар 56 центов, два юаня 36 феней
* Подстановка единиц во множественную форму без прописи числа: 51 единица, 22 единицы, 5 единиц
* Пропись чисел со склонением любой единицы измерения (задаются 3 формы мн.ч. и род): двести пятьдесят шесть бутявок одна козявка

## Использование
### Подключить файл chislogon.js к ресурсам веб-страницы
```
<script src="chislogon.js"></script>
```
### Для общего случая вызвать функцию common у объекта chislogon
```
console.log(chislogon.common('256'))
=> "двести пятьдесят шесть"

console.log(chislogon.common('256', ["f", "бутявка", "бутявки", "бутявок"]))
=> "двести пятьдесят шесть бутявок"

console.log(chislogon.common('000', ["f", "бутявка", "бутявки", "бутявок"]))
=> ""

console.log(chislogon.common('000', ["f", "бутявка", "бутявки", "бутявок"], "ноль бутявок"))
=> "ноль бутявок"

console.log(chislogon.common('2', ["f", "бутявка", "бутявки", "бутявок"], false, true))
=> "2 бутявки"

```
* 1 аргумент - число в строковом формате
* 2 аргумент - склонение единицы измерения: ["род", "форма для 1", " форма для 2-4", "форма для 4-9 и 0"]
* 3 аргумент - поведение единицы измерения при нуле: true - показывать, false - не показывать, "ноль" свой вариант
* 4 аргумент - (true/false) оставить число и просклонять только единицу измерения

### Для случая с десятичными вызвать функцию decimal у объекта chislogon
```
console.log(chislogon.decimal('256.89'))
=> "двести пятьдесят шесть целых восемьдесят девять сотых"

console.log(chislogon.decimal('1000256,001'))
=> "один миллион двести пятьдесят шесть целых одна тысячная"

console.log(chislogon.decimal('15454656532546,2454545455'))
=> "пятнадцать триллионов 
четыреста пятьдесят четыре миллиарда
шестьсот пятьдесят шесть миллионов
пятьсот тридцать две тысячи
пятьсот сорок шесть целых
два миллиарда
четыреста пятьдесят четыре миллиона
пятьсот сорок пять тысяч
четыреста пятьдесят пять десятимиллиардных"

console.log(chislogon.decimal('0.0'))
=> ""

console.log(chislogon.decimal('1000256,001', {off_base:true, off_part:true}))
=> "1000256 целых 1 тысячная"

console.log(chislogon.decimal('0.0', {zero_base:true, zero_part:true}))
=> "ноль целых ноль десятых"

console.log(chislogon.decimal('0.0', {zero_base:true, zero_part:false}))
=> "ноль целых"

console.log(chislogon.decimal('0.0', {zero_base:false, zero_part:true}))
=> "ноль десятых"

console.log(chislogon.decimal('236,0', {zero_base:false, zero_part:"ровно"}))
=> "двести тридцать шесть целых ровно"

```

### Для случая с денежными суммами вызвать функцию currency у объекта chislogon
