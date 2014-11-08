/*3. Инициализация модели Contact с полями по умолчанию*/
ContactManager.Models.Contact = Backbone.Model.extend({
  defaults: {
    name: null,
    tel: null,
    email: null,
    avatar: null
  },
/*4. метод вызывается при создании модели*/
  initialize: function() {
  	/*5. Устанавливаем рандомный аватар*/
    this.set('avatar', _.random(1, 15) + '.jpg');
  }
});
