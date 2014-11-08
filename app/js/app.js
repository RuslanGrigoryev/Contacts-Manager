window.ContactManager = {
  Models: {},
  Collections: {},
  Views: {},

  start: function(data) {
    /*1. создается коллекция контаков из скрипта под index.html*/
    var contacts = new ContactManager.Collections.Contacts(data.contacts),
    /*6. Создаем роутер Router*/
        router = new ContactManager.Router();

/*8. ПО умолчанию переходим на страницу #contacts*/
    router.on('route:home', function() {
      router.navigate('contacts', {
        trigger: true,
        replace: true
      });
    });

/*9. Так как мы все время будем на index.html#contacts
     то поставим роутер, при котором будет выполняться функция showContacts
*/
    router.on('route:showContacts', function() {
      /*10 создаем вьюху из коллекции contacts*/
      var contactsView = new ContactManager.Views.Contacts({
        collection: contacts
      });

      /*14. в Dom-element рендерим всю  нашу коллекцию с помощью метода render*/
      $('.main-container').html(contactsView.render().$el);
    });

    /*31. Роутер на создание нового контакта*/
    router.on('route:newContact', function() {
      /*32. Создаем форму создания нового контакта из вьюхи ContactForm*/
      var newContactForm = new ContactManager.Views.ContactForm({
        model: new ContactManager.Models.Contact()
      });

      /*35-36. рендерим вид формы создания нового контакта*/
      $('.main-container').html(newContactForm.render().$el);

      /*37. После заполнения полей - обработчик на submit*/
      newContactForm.on('form:submitted', function(attrs) {
        /*38. Ставим id новому контакту, если до этого не было , то 1 , если до этого были контакты, то последний + 1*/
        attrs.id = contacts.isEmpty() ? 1 : (_.max(contacts.pluck('id')) + 1);
        /*39. Добавляем мэлемент в коллекцию*/
        contacts.add(attrs);
        /*40. Переходим на страницу контакты index.html#contacts*/
        router.navigate('contacts', true);
      });
      
    });

/*41 Роутер для редактирования формы создания контакта*/

    router.on('route:editContact', function(id) {
      var contact = contacts.get(id),/*42 Создаем переменную с редактируемым элементом */
          editContactForm;

      if (contact) {
        /*43 Создаем новый вид представления формы редактирования*/
        editContactForm = new ContactManager.Views.ContactForm({
            model: contact
        });

        /*44. */
        $('.main-container').html(editContactForm.render().$el);

        editContactForm.on('form:submitted', function(attrs) {
        /*45 При отправке формы , устанавливаем новые параметры элементу*/
          contact.set(attrs);
          router.navigate('contacts', true);/*46 Переходим на страницу контакты*/
        });

      } else {
        router.navigate('contacts', true); /*Иначе переходим на страницу контакты*/
      }
    });

    Backbone.history.start();
  }
};
