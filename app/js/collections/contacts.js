/*2. Инициализация коллекции с моделью Contact*/
ContactManager.Collections.Contacts = Backbone.Collection.extend({
  model: ContactManager.Models.Contact
});
