/*!
 * jVForms (javascript validate forms)
 * MIT licensed
 *
 * Copyright (C) 2013 Lubaev Kirill <lubaevka@gmail.com>
 */

var jVForms = (function() {
    
    'use strict';
    
    var CLASS_SUBMIT = 'vf-submit',
        CLASS_VALID = 'vf-valid',
        CLASS_INVALID = 'vf-invalid',
        
        config = {
            
           // Шаблоны проверки формы.
           pattern: {
               
               all: '[\\S]+',                   // любой символ из набора.
               
               numInt: '^\\d+$',                // число целое.
               numFloat: '^\\d+(\\.|,)\\d+$',   // число десятичное.
               notNum: '^\\D+$',                // кроме чисел.
               index: '^\\d{6}$',               // числовой индекс.
               
               wordUpper: '^[A-ZА-ЯЁ-]+$',      // слово на Ru/US в верхнем регистре и знак(-).
               wordLower: '^[a-zа-яё-]+$',      // слово на Ru/US в нижнем регистре и знак(-).
               wordRuUpper: '^[А-ЯЁ-]+$',       // слово на Ru в верхнем регистре и знак(-).
               wordRuLower: '^[а-яё-]+$',       // слово на Ru в нижнем регистре и знак(-).
               wordUSUpper: '^[A-Z-]+$',        // слово на US в верхнем регистре и знак(-).
               wordUSLower: '^[a-z-]+$',        // слово на US в нижнем регистре и знак(-).
               
               stringRu: '^[^a-zA-Z]+$',        // сторка любая не содержащая US букв.
               stringUS: '^[^а-яА-ЯёЁ]+$',      // сторка любая не содержащая Ru букв.
               
               timeHM: '^[012][\\d]:[012345][\\d]$',        // время в формате час:минуты.
               dateDMY: '^[0123][\\d]/[01][\\d]/[\\d]{4}$', // дата в формате день/месяц/год.
               dataDMYus: '[01][\\d]/[0123][\\d]/[\\d]{4}', // дата в форматк месяц/день/год.
               
               cc: '^[\\d]{4}\\s[\\d]{4}\\s[\\d]{4}\\s[\\d]{4}$', // кредитная карта в формате 9999 9999 9999 9999.
               
               phone: '^[\\d]{3}(\\s|-)?[\\d]{2}(\\s|-)?[\\d]{2}$',     // номер в формате 999 99 99|9999999|999-99-99|999-99 99.
               phoneDash: '^\\([\\d]{3}\\)\\s[\\d]{3}(\\s|-)[\\d]{4}$', // номер в формате (999) 999-9999|(999) 999 9999.
               phoneAlong: '^\\([\\d]{3}\\)\\s[\\d]{7}$',               // номер в формате (999) 9999999.
               
               test: '^test$'
           },
           
           // Off | Error | All.
           notice: 'All'
           
        }
        
        ;
    
    function initialize( options ) {
        
        extend( config, options );
        
        setup();
        
    }
    
    function setup() {
        
        if ( !config.notice && typeof config.notice !== 'String' ) {
            return ;
        }
        
        var val = config.notice.toLowerCase();
        
        val === 'error' && (config.mode = 2) ||
        val === 'all'   && (config.mode = 1) ||
        val === 'off'   && (config.mode = 0);
    
        if ( typeof config.mode === 'undefined' ) { return ; }
        
        searchForm();
    }
    
    // Дополнить объект свойствами.
    function extend( a, b ) {
        for( var x in b ) {
            a[ x ] = b[ x ];
        }
    }
    
    
    function searchForm() {
        
        // Обходим все формы в документе.
        for( var i=0, lenF=document.forms.length; i<lenF; i++ ) {
            
            // Текущая форма.
            var f = document.forms[ i ],
                needsValid;
            
            // Идентификатор текущей формы.
            // "id" имеет приоритет выше, чем "name".
            var idForm = f.id || f.getAttribute( 'name' );
            
            
            // Обходим все элементы в форме.
            for( var j=0, lenE=f.elements.length; j<lenE; j++ ) {
                
                // Текущий элемент.
                var e = f.elements[ j ];
                
                // Проверить тип элемента.
                // Только text и textarea.
                if ( !/^text(area)?$/.test(e.type) ) continue;
                
                // Получить шаблон элемента и его требование.
                var pattern  = e.getAttribute( 'pattern' ),
                    required = e.getAttribute( 'required' ) !== null;
                   
                // Если шаблон pattern не установлен, выполним поиск класса.
                // Класс должен быть в формате class="vf-шаблон"
                // где шаблон, это одно из предоставленных имен шаблонов.
                // Пример: class="vf-numInt" , только целые числа.
                if ( !pattern ) {
                    var namePattern = jVForms.libClass.containsMatch(e, /^vf-([a-zA-Z]+)$/, true);
                        
                    pattern = ( /^(all|numInt|numFloat|notNum|index|wordUpper|wordLower|wordRuUpper|wordRuLower|wordUSUpper|wordUSLower|stringRu|stringUS|timeHM|dateDMY|dataDMYus|cc|phone|phoneDash|phoneAlong|test)$/.test(namePattern) ) ?
                        config.pattern[namePattern] :
                        config.pattern.all;
                    
                 }
                // Проверим требование элемента.
                // Если он не обязателен, завернем его в скобки, добавив "?".
                if ( !required ) pattern = pattern.replace(/^(\^)?([^\$]+)(\$)?$/, "$1($2)?$3");
                
                //e.removeAttribute( 'pattern' );
                e.setAttribute( 'pattern', pattern );
                
                // change
                jVForms.jevent.add( e, 'change', validateONchange );
                // keyup
                jVForms.jevent.add( e, 'keyup', validateONkey );
                
                needsValid = true;
                
            }
            
            // Если хотя бы один элемент требует проверки, 
            // установить обработчик для формы.
            if (needsValid) {
                
                // 1. Обработчик на кнопку submit.
                jVForms.jevent.add( f, 'submit', validateONsubmit );
                
                // 2. Обработчик на элементы с классом vf-submit внутри формы.
                var vfSubmit = jVForms.libClass.search( CLASS_SUBMIT, f );
                
                for( var a=0, len=vfSubmit.length; a<len; a++ ) {
                    // установим обработчик на каждый элемент.
                    jVForms.jevent.add( vfSubmit[ a ], 'click', validateONsubmit );
                }
                
                // 3. Обработчик на элементы с классом vf-submit вне формы.
                // Чтобы найти элементы вне формы, у них должен быть класс, 
                // с именем идентификатора текущей формы.
                // Если это так, удалим класс и назначем ему аттрибут form.
                if ( idForm ) {
                    
                    // Найдем в документе все элементы с классом vf-submit.
                    vfSubmit = jVForms.libClass.search( CLASS_SUBMIT );
                    
                    for( var b=0, leng=vfSubmit.length; b<leng; b++ ) {
                        
                        if (  jVForms.libClass.contains( vfSubmit[ b ], idForm ) ) {
                            //свяжем элемент с текущей формой аттрибутом form
                            jVForms.libClass.remove( vfSubmit[ b ], idForm );
                            vfSubmit[ b ].setAttribute( 'form', idForm );
                            // установим обработчик на каждый элемент.
                            jVForms.jevent.add( vfSubmit[ b ], 'click', validateONsubmit );
                        }
                        
                    }
                }
                
            }
            
        }
        
     }
    
    // ----------------------------- EVENTS -------------------------------//
    
    function validateONchange( event ) {
        
        var e = jVForms.jevent.fix(event);
        var el = e.target;
        var attr = el.getAttribute( "pattern" );
        var value = el.value;
        var pattern = new RegExp( attr );
        
        if ( pattern.test(value) ) {
            
            // Если notice не отключен, выполним подсветку формы.
            if (config.mode !== 0) {
                notification.notice.valid( el );
            }
            
            jVForms.libClass.remove( el, CLASS_INVALID );
            jVForms.libClass.add( el, CLASS_VALID );
            
        } else {
            
            // Если notice не отключен, выполним подсветку формы.
            if (config.mode !== 0) {
                notification.notice.invalid( el );
            }
            jVForms.libClass.remove( el, CLASS_VALID );
            jVForms.libClass.add( el, CLASS_INVALID );
            
        }
        
    }
    
    
    function validateONsubmit( event ) {
        
        var e = jVForms.jevent.fix(event);
        var el = e.target,
            type = e.type,
            nodeForm = e.target,
            stop = false;
            
        // Если тип click, ищем форму, рекурсивно поднимаясь вверх по дереву.
        // Или, если есть аттрибут, то по id или name.
        if (type === 'click') {
            
            var attrForm = el.getAttribute( 'form' );
            
            if ( attrForm ) {
                nodeForm = document.getElementById( attrForm );
                
                nodeForm = nodeForm || document.getElementsByName( attrForm );
            }
            else {
                nodeForm = (function find( n ) {
                    
                               if (n.nodeType == 1) {
                                   if (/^form$/i.test(n.nodeName)) return n;
                                   var foo = find( n.parentNode );
                               }
                
                               return foo;
                            }( el.parentNode ));
            }
            
            // Если форма не определена.
            if ( !nodeForm ) { return false; }
        
        }
        
        // Обходим все элементы в форме.
        for( var i=0, len=nodeForm.elements.length; i<len; i++ ) {
        
            // Текущий элемент.
            var element = nodeForm.elements[ i ];
            
            if ( /^text(area)?$/.test(element.type) ) {
                
                jVForms.jevent.trigger( element, 'change' );
                
                if ( jVForms.libClass.contains(element, CLASS_INVALID) ) {
                    stop = true;
                }
            
            }
            
        }
        
        if ( stop ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        return true;
    }
    
    
    function validateONkey( event ) {
        
        var e = jVForms.jevent.fix(event);
        var el = e.target;
        
        jVForms.jevent.trigger( el, 'change' );
        
    }
    
    
    // -------------------------- NOTIFICATION ----------------------------//
    
    var notification = {
        
        // Замечания. 
        // Устанавливает или удаляет подсветку текстового поля.
        
        notice: {
            
            bgColor: {
                // [0]: Bad, [1]: Good, [2]: Normal.
                hex: ['#ff4f4f','#83ff83'],
                rgb: ['rgba(255,79,79,.7)','rgba(131,255,131,.7)']
            },
            
            // Если элемент прошел проверку.
            valid: function( el ) {
                
                if (!notification.notice.bgColor.hex[2]) notification.notice.getStyle( el );
                
                // ie<9 not rgba
                try {
                    el.style.backgroundColor = (config.mode === 1) ? notification.notice.bgColor.rgb[1] : 
                                                                     notification.notice.bgColor.hex[2];
                } catch(exp) {
                    el.style.backgroundColor = (config.mode === 1) ? notification.notice.bgColor.hex[1] : 
                                                                     notification.notice.bgColor.hex[2];
                }
                
            },
            
            // Если элемент не прошел проверку.
            invalid: function( el ) {
                
                if (!notification.notice.bgColor.hex[2]) notification.notice.getStyle( el );
                
                // ie<9 not rgba
                try {
                    el.style.backgroundColor = notification.notice.bgColor.rgb[0];
                } catch(exp) {
                    el.style.backgroundColor = notification.notice.bgColor.hex[0];
                }
                
            },
            
            // Получить родные стили элемента.
            // Только те, что перечислены в notification.notice.styles.
            getStyle: function( el ) {
                var computedStyle = el.currentStyle || window.getComputedStyle(el, null);
                
                notification.notice.bgColor.hex.push(computedStyle.backgroundColor);
            }
            
        }
        
    };
    
    // ------------------------------ API ---------------------------------//
    
    return {
        initialize: initialize
    };
}());


    // --------------------------- LIB jEVENT ------------------------------//

jVForms.jevent = {
    
    add: function(el, event, func) {
        
        if ( el.addEventListener ) {
             el.addEventListener(event, func, false); 
             return ;} 
        
        if ( el.attachEvent ) {
             el.detachEvent('on'+ event, func);
             el.attachEvent('on'+ event, func); 
             return ;}
         
         el['on'+ event] = func;
        
    },
    
    remove: function(el, event, func) {
        
        if ( el.removeEventListener ) {
             el.removeEventListener(event, func, false); 
             return ;} 
         
        if ( el.detachEvent ) {
             el.detachEvent('on'+ event, func); 
             return ;}
        
        el['on'+ event] = null;
        
    },
    
    trigger: function(el, event) {
        
        var e,
            ie = false;
        
        if ( document.createEvent ) {
            e = document.createEvent( "HTMLEvents" );
            e.initEvent(event, false, true);
            
        }
        else
        if ( document.createEventObject ) {
            e = document.createEventObject( );
            e.eventType = event;
            ie = true;
            
        }
        else {
            return false;
        }
        
        return (ie) ? el.fireEvent( "on"+e.eventType, e ) : el.dispatchEvent( e );
        
    },
    
    fix: function(event) {
        
        event = event || window.event;
        
        if ( event.isFixed ) { return event; }
        
        var body, doc,
            button = event.button,
            fromElement = event.fromElement;
        
        
        event.preventDefault =  event.preventDefault || function(){ this.returnValue = false; };
        event.stopPropagation = event.stopPropagaton || function(){ this.cancelBubble = true; };
        
        // Support: IE<9
        if ( !event.target ) {
            event.target = event.srcElement || document;
        }
        
        // Support: Chrome 23+, Safari?
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }
        
        // Support: IE<9
        event.metaKey = !!event.metaKey;
            
        // Add relatedTarget, if necessary
        if ( !event.relatedTarget && fromElement ) {
              event.relatedTarget = fromElement === event.target ? event.toElement : fromElement;
        }
        
        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && event.clientX != null ) {
                
            doc = document.documentElement,
            body = document.body;
                    
            event.pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
            event.pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                
        }
            
        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if ( !event.which && button !== undefined ) {
                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
        }
        
        // Add which for key events
        if ( !event.which ) {
               event.which = event.charCode != null ? event.charCode : event.keyCode;
        }
        
        event.time = (new Date).getTime();
        
        event.isFixed = true;
        
        return event;
        
    }
    
};


    // ---------------------------- LIB CLASS -----------------------------//
    
    
jVForms.libClass = {

    /**
     * Добавить класс.
     *
     * @param {HTMLElement} el требуемый элемент.
     * @param {String} nameClass имя, которое требуется установить.
     * 
     * @return {String|Boolean} новое имя класса или ложь.
     */
     add: function( el, nameClass ) {
     
         // Получить список классов.
         var classList = el.className,
             space = /\s+/;
     
         // Если ни один класс не установлен.
         if (!classList) {
              el.className = nameClass;
              return nameClass;
         }
     
         // Здесь ожидается, что className установленно.
     
         // Проверим, возможно устанавливаемый класс уже назначен.
         if (classList === nameClass) {
              return false;
         }
            
         // Проверим, есть ли пробелы у назначенных классов.
         // Если пробелов нет, смело добавим новый класс
         // в начало списка классов.
         if (!space.test(classList)) {
              el.className = nameClass+' '+classList;
              return nameClass;
         }
            
         // Иначе могут быть пробельные символы.
         // Разобьем строку.
         var classListArray = classList.split( space );
                
                
         for ( var i=0, len=classListArray.length; i<len; i++ ) {
                    
              // Возможно в списке уже есть устанавливаемый класс.
              if (classListArray[ i ] === nameClass) {
                   return false;
              }
                   
         }
            
         el.className = nameClass+' '+classList;
                
         return nameClass;
                
     },
        
     /**
     * Удалить класс.
     *
     * @param {HTMLElement} el требуемый элемент.
     * @param {String} nameClass имя, которое требуется удалить.
     * 
     * @return {String|Boolean} удаляемое имя класса или ложь.
     */
     remove: function( el, nameClass ) {
            
         // Получить список классов.
         var classList = el.className,
             space = /\s+/;
                
         // Если ни один класс не установлен.
         if (!classList) {
              return false;
         }
                
         // Здесь ожидается, что className установленно.
                
         // Проверим, возможно устанавливаемый класс уже назначен.
         if (classList === nameClass) {
              el.removeAttribute( "class" );
              return nameClass;
         }
                
         // Проверим, возможно есть другие классы или пробелы.
         // Если пробелов нет, значит этот класс не установлен.
         if (!space.test(classList)) {
              return false;
         }
                
         // Иначе разберем массив классов.
         var classListArray = classList.split( space ),
             classListNew = [];
                
         for ( var i=0, len=classListArray.length; i<len; i++ ) {
                    
              // Возможно в списке уже есть устанавливаемый класс.
              if (classListArray[ i ] !== nameClass) {
                   classListNew.push( classListArray[ i ] );
              }
                   
         }
         el.className = classListNew.join( ' ' );
                
         return nameClass;
                
     },
        
     /**
     * Переключить класс.
     *
     * @param {HTMLElement} el требуемый элемент.
     * @param {String} nameClass имя, которое требуется переключить.
     */
     toggle: function( el, nameClass ) {
            
         this.contains(el, nameClass) ?
         this.remove(el, nameClass) :
         this.add(el, nameClass);
     
     },
        
     /**
     * Проверить класс.
     *
     * @param {HTMLElement} el требуемый элемент.
     * @param {String} nameClass имя, которое требуется проверить.
     * 
     * @return {Boolean} если имя класса найдено, возвращает истину,
     * иначе ложь.
     */
     contains: function( el, nameClass ) {
            
         // Получить список классов.
         var classList = el.className,
             space = /\s+/;
                
         // Если ни один класс не установлен.
         if (!classList) {
              return false;
         }
                
         // Если точное совпадение.
         if (classList === nameClass) {
              return true;
         }
                
         // Если нет пробелов, значит не наш класс.
         if (!space.test(classList)) {
              return false;
         }
                
         var classListArray = classList.split( space );
                
         for ( var i=0, len=classListArray.length; i<len; i++ ) {
                    
              if (classListArray[ i ] === nameClass) {
                   return true;
              }
                    
         }
            
         return false;
            
     },
     
     /**
      * Проверить класс на соответствие рег. выр.
      *
      * @param {HTMLElement} el требуемый элемент.
      * @param {Object} expression объект RegExp.
      * @param {Boolean} match флаг указывающий на значение, 
      * которое должна вернуть функция.
      * 
      * @return {Boolean|String} возвращает булев тип true|false, если 
      * match не установлен, либо установлен в false, либо установлен не 
      * правильно. Возвращает строку, содержащую найденное соответствие, если
      * match установлен в true. Возвращает пустую строку, если соответствий
      * не обнаруженно.
      */
     containsMatch: function( el, expression, match ) {
         
         if (typeof expression === 'object' && expression instanceof RegExp) {
             
             // Получить список классов.
             var classList = el.className,
                 space = /\s+/;
                 
             match = (match && typeof match === 'boolean') || false;
                 
             // Если ни один класс не установлен.
             if (!classList) {
                  return match ? '' : false;
             }
             
             // Если точное совпадение, вытащим его.
             if (expression.test(classList)) {
                 
                 return match ? classList.match(expression).pop() : true;
                 
             }
             
            // Если пробелов нет, 1 класс и он не наш.
            if (!space.test(classList)) {
                return match ? '' : false;
            }
            
            var classListArray = classList.split( space );
            
            for ( var i=0, len=classListArray.length; i<len; i++ ) {
                
                // Если точное совпадение, вытащим его.
               if (expression.test(classListArray[ i ])) {
                   
                   return match ? classList.match(expression).pop() : true;
                   
               }
                
            }
            
            return match ? '' : false;
            
         }
         
     },
        
    /**
     * Количество классов.
     *
     * @param {HTMLElement} el требуемый элемент.
     * 
     * @return {Number} количество классов у элемента.
     */
     length: function( el ) {
            
         // Получить список классов.
         var classList = el.className,
             space = /\s+/,
             zero = 0;
            
         // Если ни один класс не установлен.
         if (!classList) {
              return zero;
         }
            
         // Если нет пробелов, значит 1.
         if (!space.test(classList)) {
              return 1;
         }
            
         var classListArray = classList.split( space ),
             classListNew = [];
            
         for ( var i=0, len=classListArray.length; i<len; i++ ) {
                    
              if ( /\S/.test( classListArray[ i ] ) ) {
                   classListNew.push( classListArray[ i ] );
              }
                
         }
            
         return classListNew.length;
            
     },
        
     /**
     * Поиск класса в документе или узле.
     *
     * @param {String} nameClass имя, которое требуется найти.
     * @param {HTMLElement} node узел, в котором будет выполнен поиск.
     * 
     * @return {Array} массив, содержащий все найденные элементы в документе,
     * для которых установлен искомый класс.
     */
     search: function( nameClass, node ) {
            
         var el = [],
             space = /\s+/,
             that = this;
                
         if ( !nameClass || space.test(nameClass) || (typeof nameClass !== 'string') ) {
              return el;
         }
         node = node || document.body;
                
         (function find( n ) {
                    
              if (n.nodeType == 1) {
                   if ( that.contains(n, nameClass) ) el.push(n);
                   for( var child = n.childNodes, i=0, len=child.length; i<len; i++ ) find( child[ i ] );
              }
                    
              return ;
                    
         }(node));
                
         return el;
                
     }
        
};