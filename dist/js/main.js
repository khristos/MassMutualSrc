(function() {

  const url = 'http://localhost:3000/js/exercise-sample-data.json';

  fetch(url)
    .then(res => res.json())
    .then(res => {
      let response = res.response.docs;
      console.log("Fetch json: ", response);
      news.getDocs(response);
    })
    .catch(error => console.log(error));

  // Utility functions
  function $on(target, type, callback, capture) {
    target.addEventListener(type, callback, !!capture);
  }

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  }

  function hide(el) {
    el.style.display = 'none';
  }

  function show(el, value) {
    el.style.display = value;
  }

  function toggle(el, value) {
    var display = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;
    if (display == 'none') { el.style.display = value; }
    else { el.style.display = ''; }
  }

  function setHamburger() {
    $on(view.$hamburger, 'click', function(e) {
      e.preventDefault();
      toggle(view.$pageNav, 'block');
    });
  }

  function setEvents() {
    $on(view.$searchButton, 'click', function(e) {
      e.preventDefault();
      hide(view.$stories);
      hide(view.$storiesDetail);
      show(view.$storiesSearch, 'block');
    });
    $on(view.$searchForm, 'submit', function(e) {
      e.preventDefault();
    });
    let els = view.$homeButton;
    let links = els.forEach((item, i) => {
      $on(item, 'click', function(e) {
        e.preventDefault();
        hide(view.$storiesDetail);
        show(view.$stories, 'block');
        hide(view.$storiesSearch);
      });
    });
    /*$on(qsa('a[href=#home]'), 'click', function(e) {
      e.preventDefault();
      hide(view.$storiesDetail);
      show(view.$stories, 'block');
    });*/
  }

  // Collect all article metadata for bespoke instances
  class ArticleDefault {
    constructor(doc) {
      this._id = doc._id;
      this.url = doc.web_url;
      this.title = doc.headline.main;
      this.bodySnippet = doc.snippet;
      this.bodyLead = doc.lead_paragraph;
      this.pubDate = doc.pub_date;
      this.bylinePerson = doc.byline.person;
      this.bylineOriginal = doc.byline.original;
      this.source = doc.source;
      this.multimedia = doc.multimedia;
    }
  }

  const view = {
    $hamburger: qs('.page-nav__hamburger'),
    $pageNav: qs('.page-nav__ul'),
    $homeButton: qsa('a[href="#home"]'),
    $searchForm: qs('.page-header .m-search'),
    $searchButton: qs('.page-header .m-search__button'),
    $stories: qs('#stories'),
    $storiesDetail: qs('#stories-detail'),
    $storiesSearch: qs('#stories-search'),
    nytMediaUrl: 'https://static01.nyt.com/',
    topStory: '.storiesView_1 .stories__top',
    topStoryAside: '.storiesView_1 .stories__group',
    topStoryList: '.storiesView_2 .stories__collection',
    topStoryDetail: '.stories__detail',
    topStorySearch: '.stories__search .stories__collection',
    storyTitle: '.stories__title',
    cardTitle: '.m-card-title',
    textMeta: '.m-text-meta',
    cardBody: '.m-card-body',
    cardMedia: '.m-card-media',
    render(target, content, attributes) {
      console.log('render() invoked', '\n', 'content');
      for(const key in attributes) {
        target.setAttribute(key, attributes[key]);
      }
      target.innerHTML = content;
    }
  };

  const news = {
    getDocs(feed) {
      console.log('getDocs() invoked');
      this.docs = feed;
      this.addArticles();
    },
    addArticles() {
      console.log('addArticles() invoked');
      this.articles = this.docs.map(function(item) {
        return new ArticleDefault(item);
      });
      console.log(this.articles);
      this.setUp();
    },
    setUp() {
      console.log('setUp() invoked');
      this.topStory();
      this.topStoriesAside();
      this.topStoriesList();
      this.topStoriesDetailLinks();
      this.topStoriesDetail();
      this.topStoriesSearch();
    },
    topStory() {
      console.log('topStory() invoked');
      const data = this.articles.find(function(element){return element.multimedia.length > 0 });

      // Article selectors
      const articleTitle = (qs(view.topStory + ' ' + view.cardTitle));
      const articleByline = (qs(view.topStory + ' ' + view.textMeta));
      const articleBody = (qs(view.topStory + ' ' + view.cardBody));
      const articleMedia = qs(view.topStory + ' ' + view.cardMedia);

      const templateTitle = (data) => {
        return `<a href="#${data._id}" rel="next">${data.title}</a>`;}
      let content = templateTitle(data);
      view.render(articleTitle, content);

      //Article byline
      const templateByline = (data) => {
        return `
        <span class="author" itemprop="author">${data.bylineOriginal}</span>
        <time data-utc-timestamp="${data.pubDate}" datetime="${data.pubDate}">${data.pubDate}</time>
      `;
      }
      content = templateByline(data);
      view.render(articleByline, content);

      // Article body
      const templateBody = `${data.bodyLead}`;
      content = templateBody;
      view.render(articleBody, content);

      // Article image
      const templateMedia = `<img src="${view.nytMediaUrl}${data.multimedia[0].url}" alt="Demo Image" style="width:226px; height:150px">`;
      content = templateMedia;
      view.render(articleMedia, content);
    },
    topStoriesAside() {
      console.log('topStoriesAside() invoked');
      const data = this.articles.filter(element => element.multimedia.length === 0);

      const templateAside = (data) => {
        return `
        <li class="grid-xs--12">
          <article class="stories__theme-summary">
            <div class="m-card m-card-default">
              <div class="m-card-header">
                <div class="flex-grid">
                  <div class="width-expand first-column">
                    <h3 class="m-card-title margin-remove-bottom"><a href="#${data._id}" rel="next">${data.title}</a></h3>
                  </div>
                </div>
              </div>
              <div class="m-card-footer">
                <p class="m-text-meta margin-remove-top">
                <span class="author" itemprop="author">${data.bylineOriginal}</span>
                <time data-utc-timestamp="${data.pubDate}" datetime="${data.pubDate}">${data.pubDate}</time>
                </p>
              </div>
            </div>
          </article>
        </li>
      `;
      }

      let topStoryAside = (qs(view.topStoryAside));
      let content = data.filter((item, i) => i < 2)
        .map((item, i) => templateAside(item))
        .join('');
      //console.log(content);
      view.render(topStoryAside, content);
    },

    topStoriesList() {
      console.log('topStoriesList() invoked');
      const data = this.articles.filter(function(element){return element.multimedia.length > 0 });

      const templateList = (data) => {
        return `
        <div class="m-card m-card-default grid-collapse flex-grid margin">
          <div class="m-card-media-left cover-container first-column grid-sm--3">
            <img src="${view.nytMediaUrl}${data.multimedia[0].url}" alt="Demo Image" class="cover" style="width:100%; height:100%">
            <canvas width="600" height="400"></canvas>
          </div>
          <div class="grid-sm--9">
            <div class="m-card-body grid-collapse flex flex-column">
              <h3 class="m-card-title"><a href="#${data._id}" rel="next">${data.title}</a></h3>
              <p>${data.bodyLead}</p>
              <footer class="m-card-footer">
                <p class="m-text-meta margin-remove-top">
                  <span class="author" itemprop="author">${data.bylineOriginal}</span>
                  <time data-utc-timestamp="${data.pubDate}" datetime="${data.pubDate}">${data.pubDate}</time>
                </p>
              </footer>
            </div>
          </div>
        </div>
      `;
      }

      let topStoryList = (qs(view.topStoryList));
      let content = data.map((item, i) => templateList(item)).join('');
      //console.log(content);
      view.render(topStoryList, content);
    },

    topStoriesDetailLinks() {
      console.log('topStoriesDetailLinks() invoked');
      let els = document.querySelectorAll('a[rel="next"]');
      //console.log(els);
      let links = els.forEach((item, i) => {
        $on(item, 'click', function(e) {
          e.preventDefault();
          let hash = item.hash;
          news.topStoriesDetail(hash);
          show(view.$storiesDetail, 'block');
          hide(view.$stories);
          hide(view.$storiesSearch);
        });
      });
    },

    topStoriesDetail(hash) {
      console.log('topStoryDetail() invoked');
      this.topStoriesDetailLinks();
      let _id = hash ? hash.substr(1) : '597f45677c459f246b61be60';

      const data = this.articles.find(function(element){return element._id === _id});

      // Article selectors
      const articleTitle = (qs(view.topStoryDetail + ' ' + view.storyTitle));
      const articleByline = (qs(view.topStoryDetail + ' ' + view.textMeta));
      const articleBody = (qs(view.topStoryDetail + ' ' + view.cardBody));
      const articleMedia = qs(view.topStoryDetail + ' ' + view.cardMedia);

      const templateTitle = (data) => {return `${data.title}`;}
      let content = templateTitle(data);
      view.render(articleTitle, content);

      //Article byline
      const templateByline = (data) => {
        return `
        <span class="author" itemprop="author">${data.bylineOriginal}</span>
        <time data-utc-timestamp="${data.pubDate}" datetime="${data.pubDate}">${data.pubDate}</time>
      `;
      }
      content = templateByline(data);
      view.render(articleByline, content);

      // Article body
      const templateBody = `${data.bodyLead}`;
      content = templateBody;
      view.render(articleBody, content);

      // Article image
      if (data.multimedia.length > 0) {
        const templateMedia = `<img src="${view.nytMediaUrl}${data.multimedia[0].url}" alt="Demo Image" style="">`;
        content = templateMedia;
        view.render(articleMedia, content);
      }
    },

    topStoriesSearch() {
      console.log('topStorySearch() invoked');
      const data = this.articles.filter(function(element){return element.multimedia.length > 0 });

      const templateList = (data) => {
        return `
        <div class="m-card m-card-default grid-collapse flex-grid margin divider">
          <div class="m-card-media m-card-media-left cover-container first-column grid-sm--3">
            <img src="${view.nytMediaUrl}${data.multimedia[0].url}" alt="" class="cover" style="min-width:180px; min-height:120px;">
            <canvas width="600" height="400"></canvas>
          </div>
          <div class="grid-sm--9">
            <div class="m-card-body grid-collapse flex flex-column">
              <h3 class="m-card-title"><a href="#${data._id}" rel="next">${data.title}</a></h3>
              <p>${data.bodyLead}</p>
            </div>
          </div>
        </div>
        `;
      }

      let topStorySearch = (qs(view.topStorySearch));
      let content = data.map((item, i) => templateList(item)).join('');
      view.render(topStorySearch, content);
    }
  };

  const events = {

  }

  //$on(window, 'load', setHamburger);
  
  if (document.readyState!='loading') {
    setHamburger();
    setEvents();
  }
	// modern browsers
	else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', setHamburger());
    document.addEventListener('DOMContentLoaded', setEvents());
  }

})();

