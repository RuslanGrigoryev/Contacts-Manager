/*21. Инициализируем вид элемента коллекции*/
ContactManager.Views.Contact = Backbone.View.extend({
  tagName: 'li',/*22. Будет в теге li*/
  className: 'media col-md-6 col-lg-4',/*23. с классом таким-то*/
  template: _.template($('#tpl-contact').html()),/*24. инициализируем шаблон вида элемента коллекции*/

  events: {
    'click .delete-contract': 'onClickDelete'/*Событие по кнопке Delete*/
  },

  initialize: function() {/*26. При инициализации модели поставим обработчик на удаление*/
    this.listenTo(this.model, 'remove', this.remove);
  },

/*28. Рендерим каждый элемент коллекции*/
  render: function() {
    /*29. Создаем переменную в которой будет модель в формате JSON*/
    var html = this.template(this.model.toJSON());
    /*30. В конец элемента вставляем эту модель*/
    this.$el.append(html);

    return this;
  },

  onClickDelete: function(e) {
    e.preventDefault();
    this.model.collection.remove(this.model);
  }
});
