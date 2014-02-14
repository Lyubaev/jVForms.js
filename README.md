# jVForms.js

### Что это?

Автоматическая проверка форм HTML типа text|textarea. 
Проверка форм происходит по атрибутам `required` и `pattern` и разработан, преимущественно, для браузеров, не поддерживающих данные атрибуты.
Встроенный набор шаблонов для быстрого использования.
Возможность установить обработчик отправки формы на любой HTML элемент по клику как в форме так и за ее пределами.

### Установка.

Подключите `jVForms.min.js` в конце документа перед закрывающимся тегом `body` и инициализируйте его.
```html
<script src="jVForms.min.js"></script>
<script>
    jVForms.initialize();
</script>
```

### Как?

Добавьте атрибут `required="required"` в поле формы, сделав тем самым элемент обязательным для заполнения.
```html
<input type="text" name="field_1" value="" required="required"/>
```

[required-attribute] (http://www.w3.org/html/wg/drafts/html/master/forms.html#the-required-attribute)

Добавьте атрибут `pattern="RegExp"`, где `RegExp` - ваше регулярное выражение для проверки формы.
```html
<input type="text" name="field_1" value="" required="required" pattern="^\d+$"/>
```

[pattern-attribute] (http://www.w3.org/html/wg/drafts/html/master/forms.html#the-pattern-attribute)

Если возникли трудности с добавлением регулярного выражения, можно воспользоваться готовым набором шаблонов, просто объявив их в классе.

#### Список шаблонов:

`vf-all`: Любой символ, не являющийся символом-разделителем.
`vf-numInt`: Число целое.
`vf-numFloat`: Число десятичное.
`vf-notNum`: Не число.
`vf-index`: Индекс.
`vf-wordUpper`: Слово на Ru или US в верхнем регистре и знак(-).
`vf-wordLower`: Слово на Ru или US в нижнем регистре и знак(-).
`vf-wordRuUpper`: Слово на Ru в верхнем регистре и знак(-).
`vf-wordRuLower`: Слово на Ru в нижнем регистре и знак(-).
`vf-wordUSUpper`: Слово на US в верхнем регистре и знак(-).
`vf-wordUSLower`: Слово на US в нижнем регистре и знак(-).
`vf-stringRu`: Сторка любая не содержащая US букв.
`vf-stringUS`: Сторка любая не содержащая Ru букв.
`vf-timeHM`: Время в формате час:минуты.
`vf-dateDMY`: Дата в формате день/месяц/год.
`vf-dataDMYus`: Дата в формате месяц/день/год.
`vf-cc`: Кредитная карта в формате 9999 9999 9999 9999.
`vf-phone`: Номер в формате 999 99 99 или 9999999 или 999-99-99 или 999-99 99.
`vf-phoneDash`: Номер в формате (999) 999-9999 или (999) 999 9999.
`vf-phoneAlong`: Номер в формате (999) 9999999.

Шаблонов можно объявить сколько угодно, но работать будет только первый:
```html
<input type="text" name="field_1" value="" class="vf-numInt vf-wordUSLower vf-dataDMYus otherClass"/>
```

При объявлении атрибута pattern и класса шаблона, класс шаблона работать не будет:
```html
<input type="text" name="field_1" value="" required="required" pattern="^\d+$" class="vf-numInt"/>
```

Если атрибут `required="required"` опущен и добавлен класс шаблона или атрибут `pattern`, то такое поле не является обязательным для заполнения,
но если оно все же будет заполнено, то будет проверено:
```html
<input type="text" name="field_1" value="" class="vf-numInt"/>
```

Для установки обработчика на любой другой элемент в пределах формы, необходимо добавить в него класс `vf-submit`:
```html
<form>
    <input type="text" required="required" name="name" class="vf-numInt"/>
    <input type="text" name="phone"/>
    <textarea name="area"></textarea>
        
    <span class="vf-submit">Отправить</span>
</form>
```

Для установки обработчика на любой другой элемент вне формы, необходимо добавить в него класс `vf-submit`, а также связать этот элемент с формой.
Для этого у формы необходимо указать атрибут `id` или атрибут `name` и значение этого атрибута присвоить в виде класса элементу обработчику:
```html
<form id="formId">
    <input type="text" required="required" name="name" class="vf-numInt"/>
    <input type="text" name="phone"/>
    <textarea name="area"></textarea>
</form>

<span class="vf-submit formId" >Отправить</span>
```

### Выбор уведомлений

jVForms способен менять тип уведомлений при проверке формы, для этого выделено три значения:

`Off`: отключить уведомления;
`All`: подсвечивать правильные и неправильные поля;
`Error`: подсвечивать только неправильные поля;

Значение по умолчанию: `All`. Чтобы сменить это значение на `Off`, например,  необходимо в инициализирующую функцию передать следующее:
```html
<script>
    jVForms.initialize({
	    notice: 'Off'
	});
</script>
```