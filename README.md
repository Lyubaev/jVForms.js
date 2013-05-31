# jVForms.js

### ��� ���?

�������������� �������� ���� HTML ���� text|textarea. 
�������� ���� ���������� �� ��������� `required` � `pattern` � ����������, ���������������, ��� ���������, �� �������������� ������ ��������.
���������� ����� �������� ��� �������� �������������.
����������� ���������� ���������� �������� ����� �� ����� HTML ������� �� ����� ��� � ����� ��� � �� �� ���������.

### ���������.

���������� `jVForms.min.js` � ����� ��������� ����� ������������� ����� `body` � ��������������� ���.
```html
<script src="jVForms.min.js"></script>
<script>
    jVForms.initialize();
</script>
```

### ���?

�������� ������� `required="required"` � ���� �����, ������ ��� ����� ������� ������������ ��� ����������.
```html
<input type="text" name="field_1" value="" required="required"/>
```

[required-attribute] (http://www.w3.org/html/wg/drafts/html/master/forms.html#the-required-attribute)

�������� ������� `pattern="RegExp"`, ��� `RegExp` - ���� ���������� ��������� ��� �������� �����.
```html
<input type="text" name="field_1" value="" required="required" pattern="^\d+$"/>
```

[pattern-attribute] (http://www.w3.org/html/wg/drafts/html/master/forms.html#the-pattern-attribute)

���� �������� ��������� � ����������� ����������� ���������, ����� ��������������� ������� ������� ��������, ������ ������� �� � ������.

#### ������ ��������:

`vf-all`: ����� ������, �� ���������� ��������-������������.
`vf-numInt`: ����� �����.
`vf-numFloat`: ����� ����������.
`vf-notNum`: �� �����.
`vf-index`: ������.
`vf-wordUpper`: ����� �� Ru ��� US � ������� �������� � ����(-).
`vf-wordLower`: ����� �� Ru ��� US � ������ �������� � ����(-).
`vf-wordRuUpper`: ����� �� Ru � ������� �������� � ����(-).
`vf-wordRuLower`: ����� �� Ru � ������ �������� � ����(-).
`vf-wordUSUpper`: ����� �� US � ������� �������� � ����(-).
`vf-wordUSLower`: ����� �� US � ������ �������� � ����(-).
`vf-stringRu`: ������ ����� �� ���������� US ����.
`vf-stringUS`: ������ ����� �� ���������� Ru ����.
`vf-timeHM`: ����� � ������� ���:������.
`vf-dateDMY`: ���� � ������� ����/�����/���.
`vf-dataDMYus`: ���� � ������� �����/����/���.
`vf-cc`: ��������� ����� � ������� 9999 9999 9999 9999.
`vf-phone`: ����� � ������� 999 99 99 ��� 9999999 ��� 999-99-99 ��� 999-99 99.
`vf-phoneDash`: ����� � ������� (999) 999-9999 ��� (999) 999 9999.
`vf-phoneAlong`: ����� � ������� (999) 9999999.

�������� ����� �������� ������� ������, �� �������� ����� ������ ������:
```html
<input type="text" name="field_1" value="" class="vf-numInt vf-wordUSLower vf-dataDMYus otherClass"/>
```

��� ���������� �������� pattern � ������ �������, ����� ������� �������� �� �����:
```html
<input type="text" name="field_1" value="" required="required" pattern="^\d+$" class="vf-numInt"/>
```

���� ������� `required="required"` ������ � �������� ����� ������� ��� ������� `pattern`, �� ����� ���� �� �������� ������������ ��� ����������,
�� ���� ��� ��� �� ����� ���������, �� ����� ���������:
```html
<input type="text" name="field_1" value="" class="vf-numInt"/>
```

��� ��������� ����������� �� ����� ������ ������� � �������� �����, ���������� �������� � ���� ����� `vf-submit`:
```html
<form>
    <input type="text" required="required" name="name" class="vf-numInt"/>
    <input type="text" name="phone"/>
    <textarea name="area"></textarea>
        
    <span class="vf-submit">���������</span>
</form>
```

��� ��������� ����������� �� ����� ������ ������� ��� �����, ���������� �������� � ���� ����� `vf-submit`, � ����� ������� ���� ������� � ������.
��� ����� � ����� ���������� ������� ������� `id` ��� ������� `name` � �������� ����� �������� ��������� � ���� ������ �������� �����������:
```html
<form id="formId">
    <input type="text" required="required" name="name" class="vf-numInt"/>
    <input type="text" name="phone"/>
    <textarea name="area"></textarea>
</form>

<span class="vf-submit formId" >���������</span>
```

### ����� �����������

jVForms �������� ������ ��� ����������� ��� �������� �����, ��� ����� �������� ��� ��������:

`Off`: ��������� �����������;
`All`: ������������ ���������� � ������������ ����;
`Error`: ������������ ������ ������������ ����;

�������� �� ���������: `All`. ����� ������� ��� �������� �� `Off`, ��������,  ���������� � ���������������� ������� �������� ���������:
```html
<script>
    jVForms.initialize({
	    notice: 'Off'
	});
</script>
```