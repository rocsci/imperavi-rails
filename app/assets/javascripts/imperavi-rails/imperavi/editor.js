{
  ru : {
    html : 'Код',
    redo : 'Повтор',
    undo : 'Отмена',

    plugins : {
      // Working with images
      image : {
        name     : 'Изображение'
        download : 'Скачать изображение',
        text     : 'Текст',
        mailto   : 'Эл. почта',
        web      : 'URL',
        title    : 'Подсказка',
        buttons : {
          save   : 'Сохранить',
          cancel : 'Отменить', 
          insert : 'Вставить',
          remove : 'Удалить',
        },
        align : {
          name  : 'Обтекание текстом',
          none  : 'нет',
          left  : 'слева',
          right : 'справа',
        }
      },
      // Insert video from youtube etc
      video : {
        name : 'Видео',
        code : 'Код видео ролика',
      },
      // Insert and format tables
      table : {
        name   : 'Таблица',
        insert : 'Вставить таблицу',
        remove : 'Удалить таблицу'
        row: {
          name   : 'Строки',
          above  : 'Добавить строку сверху',
          below  : 'Добавить строку снизу',
          remove : 'Удалить строку'
        },
        column: {
          name   : 'Столбцы',
          left   : 'Добавить столбец слева',
          right  : 'Добавить столбец справа',                 
          remove : 'Удалить столбец',  
        },
        header: {
          add    : 'Добавить заголовок',
          remove : 'Удалить заголовок'
        }
      },
      // Insert or remove hyperlink
      link  : {
        name   : 'Ссылка',
        insert : 'Вставить ссылку ...',
        remove : 'Удалить ссылку'
      },
      // Insert or remove hyperlink to a file
      file: {
        file      : 'Файл',
        upload    : 'Загрузить',
        download  : 'Скачать',
        choose    : 'Выбрать',
        or_choose : 'Или выберите',
        drop      : 'Перетащите файл сюда' 
      }
    },
    // Lists dropdown menu
    lists : {
      name      : 'Списки',
      unordered : 'Обычный список',
      ordered   : 'Нумерованный список'
      outdent   : 'Уменьшить отступ',
      indent    : 'Увеличить отступ',
    },
    // Styles dropdown menu
    styles : {
      name      : 'Стили',
      paragraph : 'Обычный текст',
      quote     : 'Цитата',
      code      : 'Код',
      header1   : 'Заголовок 1',
      header2   : 'Заголовок 2',
    },
    // Formatting dropdown menu
    format : {
      name   : 'Формат',
      bold   : 'Полужирный',
      italic : 'Наклонный',
      sup    : 'Надстрочный',
      sub    : 'Надстрочный',
      strike : 'Зачеркнутый',
      remove : 'Очистить форматирование',
    }
  }
};


(function( $ ) {
  $.fn.imperavi = function(options) {
    // Create some defaults, extending them with any options that were provided
    var o = $.extend({
      //'location' : 'top',
    }, options)

    // Main object
    $.fn.Imperavi = function(el) { this.initialize(el) }

    $.fn.Imperavi.prototype = {
      textarea : null,
      iframe   : null,
      toolbar  : null,
      overlay  : null,
      resizer  : null,

      // Initialize imperavi
      initialize: function(el) {
        this.textarea = $(el)
        this.build()
        this.autosave()
      },

      build: function() {
         // Create overlay
         this.overlay = new $.fn.ImperaviOverlay(o)

         // Create iframe
         this.iframe  = new $.fn.ImperaviIframe(this.textarea, o)

         // Create toolbar
         this.toolbar = new $.fn.ImperaviToolbar(this.iframe, o)

         // Create editor resizer
         this.resizer = new $.fn.ImperaviIframeResizer(this.iframe, o)
      },

      autosave: function() {
        // TODO: implement
      }
    }

    // Apply imperavi for each selected element
    return this.each(function() {
      new $.fn.Imperavi(this)
    })
  }
})(jQuery);