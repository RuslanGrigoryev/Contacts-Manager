/*11. Инициализируем вьюху всех контактов (всей коллекции)*/
ContactManager.Views.Contacts = Backbone.View.extend({
  /*12. Шаблон этой вьюхи по id tpl-contacts*/
  template: _.template($('#tpl-contacts').html()),
  /*19. рендерим каждый элемент коллекции */
  renderOne: function(contact) {
    /*20. Создаем вьюху(вид того, как должен выглядеть элемент коллекции)*/
    var itemView = new ContactManager.Views.Contact({model: contact});
    /*27. в элемент в самый конец вставляем элемент коллекции*/
    this.$('.contacts-container').append(itemView.render().$el);
  },

/*15. рендеринг всей коллекции*/
  render: function() {
    /*16. Создаем переменную, в которую запихиваем шаблон коллекции*/
    var html = this.template();
    /*17. ??????????? Наверное в позднее инициализованный элемент ($el) запихнем этот шаблон*/
    this.$el.html(html);
    

    /*18. Каждый элемент коллекции проходим в цикле и вызываем для него метод renderOne*/
    this.collection.each(this.renderOne, this);

    /*непонятно зачем возвращать объект this и выше передавать его контекст в цикле each?*/
    return this;
  }
});


/*ЧТо такое $el */