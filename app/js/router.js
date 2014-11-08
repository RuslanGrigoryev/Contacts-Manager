/*7. Инициализация роутера , методы описываются в п.8*/
ContactManager.Router = Backbone.Router.extend({
  routes: {
    '': 'home',/*8*/
    'contacts': 'showContacts',/*9*/
    'contacts/new': 'newContact',
    'contacts/edit/:id': 'editContact'
  }
});
