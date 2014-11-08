/*33. Создаем вид формы создания контакта*/
ContactManager.Views.ContactForm = Backbone.View.extend({
  /*34. инициализируем шаблон из html*/
  template: _.template($('#tpl-new-contact').html()),

  events: {
    'submit .contract-form': 'onFormSubmit'
  },

/*36. Рендер формы создания контакта*/
  render: function() {
    /*Проверяем была ли до этого модель создана ? то есть редактирование это или создание ?*/
    var html = this.template(_.extend(this.model.toJSON(), {
      isNew: this.model.isNew()
    }));
    this.$el.append(html);
        console.log(this.$el);
    console.log(this.el);
    return this;
  },

  onFormSubmit: function(e) {
    e.preventDefault();

    /*По обработчику submit присваиваем новые переменные */
    this.trigger('form:submitted', {
      name: this.$('.contact-name-input').val(),
      tel: this.$('.contact-tel-input').val(),
      email: this.$('.contact-email-input').val()
    });
  }
});
