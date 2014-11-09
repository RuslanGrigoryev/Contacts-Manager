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

/*2. Инициализация коллекции с моделью Contact*/
ContactManager.Collections.Contacts = Backbone.Collection.extend({
  model: ContactManager.Models.Contact
});


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

/*Что такое $el и attrs  в функциях*/

/*7. Инициализация роутера , методы описываются в п.8*/
ContactManager.Router = Backbone.Router.extend({
  routes: {
    '': 'home',/*8*/
    'contacts': 'showContacts',/*9*/
    'contacts/new': 'newContact',
    'contacts/edit/:id': 'editContact'
  }
});
