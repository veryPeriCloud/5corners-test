import JustValidate from 'just-validate';
import Inputmask from "inputmask";
import GraphModal from 'graph-modal';

document.addEventListener('DOMContentLoaded', () => {

  // map init
  const map = document.getElementById('map');
  ymaps.ready(init);

  function init() {
    const myMap = new ymaps.Map('map', {
      center: [55.753595, 37.621031],
      zoom: 15,
      controls: [],
    },
      {
        autoFitToViewport: 'always',
        searchControlProvider: 'yandex#search'
      });
    const myGeoObject = new ymaps.GeoObject({
      geometry: {
        type: "Point", // тип геометрии - точка
        coordinates: [55.753595, 37.621031] // координаты точки
      }
    });
    const myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
    },
      {
        iconLayout: 'default#image',
        iconImageHref: 'img/point.svg',
        iconImageSize: [27, 39],
        iconImageOffset: [0, 0]
      });

    myMap.geoObjects.add(myPlacemark);
  }

  toggleBurger();
  openSearchField();
  checkPromocode();
  counter();
  symbolsCounter();
  toggleChecker();
  toTopWindow();

  //burger
  function toggleBurger() {
    const burger = document.querySelector('[data-burger]');
    const menu = document.querySelector('[data-menu]');
    const menuItems = document.querySelectorAll('[data-menu-item]');

    burger.addEventListener('click', (e) => {
      burger.classList.toggle('burger--active');
      menu.classList.toggle('nav--active');

      if (menu.classList.contains('nav--active')) {
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Закрыть меню');
      } else {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
      }
    });

    menuItems.forEach(el => {
      el.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
        burger.classList.remove('burger--active');
        menu.classList.remove('nav--active');
      });
    });
  }

  // validation main order form
  const form = document.querySelector('.order__form')
  const telSelector = form.querySelector('input[type="tel"]');
  const im = new Inputmask("+7 (999) 999-99-99");
  im.mask(telSelector);

  const validation = new JustValidate('.order__form', {
    errorFieldCssClass: 'form__input--error',
    errorContainer: '.form__label',
    validateBeforeSubmitting: true,
  });
  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Пожалуйста, введите своё имя.',
      },
      {
        rule: 'minLength',
        value: 1,
      },
      {
        rule: 'maxLength',
        value: 30,
      },
      {
        rule: 'customRegexp',
        value: /[A-Za-zА-Яа-яЁё]/,
      },
    ])
    .addField('#lastname', [
      {
        rule: 'required',
        errorMessage: 'Пожалуйста, введите свою фамилию.',
      },
      {
        rule: 'minLength',
        value: 1,
      },
      {
        rule: 'maxLength',
        value: 40,
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Пожалуйста, укажите номер телефона',
      },
      {
        rule: 'function',
        validator: function () {
          const phone = telSelector.inputmask.unmaskedvalue();
          return phone.length === 10;
        },
        errorMessage: 'Введите корректный телефон',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Пожалуйста, введите адрес электронной почты',
      },
      {
        rule: 'email',
        errorMessage: 'Адрес электронной почты некорректен',
      },
    ])
    .addField('#address', [
      {
        rule: 'required',
        errorMessage: 'Пожалуйста, введите адрес',
      },
      {
        rule: 'minLength',
        value: 5,
      },
      {
        rule: 'maxLength',
        value: 300,
      }
    ])
    .onSuccess((event) => {
      let formData = new FormData(event.target);
      console.log(...formData);

      let xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            new GraphModal().open('submit');
          }
        }
      }

      xhr.open('POST', 'mail.php', true);
      xhr.send(formData);

      event.target.reset();
    });

  //validation footer form subscribe

  const validation2 = new JustValidate('#subscription', {
    errorContainer: '.subscription__label',
  });
  validation2
    .addField('.subscription__input', [
      {
        rule: 'required',
        errorMessage: 'Пожалуйста, введите адрес электронной почты',
      },
      {
        rule: 'email',
        errorMessage: 'Адрес электронной почты некорректен',
      },
    ])
    .onSuccess((event) => {
      let formData = new FormData(event.target);
      console.log(...formData);

      let xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            new GraphModal().open('subscribe');
          }
        }
      }

      xhr.open('POST', 'mail.php', true);
      xhr.send(formData);

      event.target.reset();
    });

  function symbolsCounter() {
    const symbols = document.querySelector('.symbols-count');
    const comment = document.querySelector('.comments__input');

    comment.addEventListener('input', () => {
      const value = comment.value.length;
      symbols.textContent = value;
    })
  }

  function toggleChecker() {
    const checker = document.querySelector('.toggle__checker');
    const input = document.querySelector('.toggle__input');

    checker.addEventListener('click', () => {

      checker.classList.toggle('active');

      if (checker.classList.contains('active')) {
        input.setAttribute('value', 'true');
        input.setAttribute('aria-label', 'Получить товар со склада');
      } else {
        input.setAttribute('value', 'false');
        input.setAttribute('aria-label', 'Получить товар из магазина');
      }
    })
  }

  function counter() {
    const btns = document.querySelectorAll('.counter__btn');
    btns.forEach(btn => {
      btn.addEventListener('click', function () {
        const direction = this.dataset.direction;
        const input = this.parentElement.querySelector('.counter__input');
        const currentValue = +input.value;
        let newValue;

        if (direction === 'plus') {
          newValue = currentValue + 1;
        } else {
          newValue = (currentValue - 1) > 0 ? (currentValue - 1) : 0;
        }
        input.value = newValue;
      })
    })
  }

  function toTopWindow() {
    const btnUp = document.querySelector('.footer__btn-up');
    btnUp.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
  }

  function openSearchField() {
    const searchBox = document.querySelector('.search__form');
    const searchBtn = searchBox.querySelector('.search__btn');
    const searchInput = searchBox.querySelector('.search__input');
    const closeBtn = searchBox.querySelector('.search__btn-close');
    const searchField = searchBox.querySelector('.search__wrapper');

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchField.classList.add('search__wrapper--active');
      closeBtn.style.display = 'block';
    })

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
    })

    document.addEventListener('click', function (e) {
      let target = e.target;
      if (!target.closest('.search__form')) {
        searchField.classList.remove('search__wrapper--active');
        closeBtn.style.display = 'none';
      }
    });
  }



  function checkPromocode() {
    const promoInput = document.getElementById('promo');
    const btnApply = document.querySelector('.order__promo-btn');
    const promoInfo = document.querySelector('.order__promo-info');

    promoInput.addEventListener('focus', () => {
      btnApply.classList.add('order__promo-btn--active');

      if (promoInfo.classList.contains('error')) {
        promoInfo.classList.remove('error');
      }
      if (promoInfo.classList.contains('success')) {
        promoInfo.classList.remove('success');
      }

      promoInfo.textContent = '';
    })

    btnApply.addEventListener('click', (e) => {
      document.querySelector('.order__promo-info').textContent = '';
      e.preventDefault();
      const promo = '1B6D9FC';
      const item = promoInput.value;
      const check = checkMatch(promo, item);

      if (check === true) {
        promoInput.setAttribute('value', promoInput.value);
        promoInfo.classList.add('success');
        promoInfo.textContent = `${promoInput.value} - купон применен`;

        promoInput.value = '';
      } else {
        promoInput.setAttribute('value', '');

        promoInput.classList.add('error');
        promoInfo.classList.add('error');
        promoInfo.textContent = `${promoInput.value} - купон не найден`;

        promoInput.value = '';
      }

      btnApply.classList.remove('order__promo-btn--active');
    })
  }

  function checkMatch(promo, item) {
    const _regex = new RegExp('^' + promo, 'i');
    return _regex.test(item);
  }

  // DADATA API - Yandex map
  const addressField = document.querySelector('#address');
  const suggestionsWrapper = document.getElementById('address-suggestions');

  addressField.addEventListener('input', () => {
    const search = addressField.value;
    const dadataToken = "69659777725c570b9f68c957867b68e5e9445eef";
    const xhr = new XMLHttpRequest();

    xhr.open(
      'POST',
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Token " + dadataToken);

    xhr.send(JSON.stringify({ "query": search }));

    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var jsonResponse = JSON.parse(xhr.responseText);
        if (jsonResponse.suggestions) {
          // console.log(jsonResponse.suggestions);
          const result = jsonResponse.suggestions;

          suggestionsWrapper.innerHTML = '';

          const list = createAddressList(result);
          const button = list.querySelectorAll('.suggestions__btn');

          list.addEventListener('click', function (e) {
            e.preventDefault();
            const target = e.target;

            if (!target.classList.contains('suggestions__list')) {
              [].forEach.call(button, function (elem) {
                elem.classList.remove('chosen');
              });
              target.classList.add('chosen');
            }

            addressField.value = target.textContent;
            setTimeout(function () {
              suggestionsWrapper.innerHTML = '';
            }, 1000)
          })
          // console.log(result);
          if (result.length > 0) {
            const geo_lat = result[0].data.geo_lat;
            const geo_lon = result[0].data.geo_lon;

            renderMap(geo_lat, geo_lon);
          }
          else {
            console.log('нет данных');
          }
        }
      }
    }

    xhr.onerror = function () {
      console.log(`Ошибка соединения`);
    };

  })

  function createAddressList(arr) {
    const list = document.createElement('list');
    list.classList.add('suggestions__list');
    list.innerHTML = '';

    for (let item of arr) {
      const region = document.createElement('li');
      const btn = document.createElement('button');
      region.classList.add('suggestions__item');
      btn.classList.add('suggestions__btn', 'btn-reset');

      btn.textContent = item.unrestricted_value;

      region.append(btn);
      list.append(region);
    }
    suggestionsWrapper.append(list);
    return list;
  }

  function renderMap(geo_lat, geo_lon) {
    map.innerHTML = '';

    ymaps.ready(init);
    function init() {
      const myMap = new ymaps.Map('map', {
        center: [geo_lat, geo_lon],
        zoom: 15,
        controls: ['geolocationControl'],
      },
        {
          autoFitToViewport: 'always',
          searchControlProvider: 'yandex#search'
        });
      const myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: [geo_lat, geo_lon] // координаты точки
        }
      });
      const myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
      },
        {
          iconLayout: 'default#image',
          iconImageHref: 'img/point.svg',
          iconImageSize: [27, 39],
          iconImageOffset: [0, 0]
        });

      myMap.geoObjects.add(myPlacemark);
    }
  }
})
