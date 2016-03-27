'use babel';
var React = require('react');
var ReactDOM = require('react-dom');
var shell = require('shell');
var request = require('request');
var DRIBBBLE_ACCESS_TOKEN = "7db78f5cb574b2309af3ea772628b42269c6bfb6767b88ba13f5294d5b9cbb8d";
var pageIndex = 1;
var perPage = 100;
var ipc = require('ipc');


function buildOptions(pageIndex, perPage) {
  return {
    url: "https://api.dribbble.com/v1/shots?page=" + pageIndex +"&per_page=" + perPage,
    headers: {
      'Authorization': 'Bearer ' + DRIBBBLE_ACCESS_TOKEN
    }
  }
}

var Shot = React.createClass({
  onTitleClick: function(event) {
    event.preventDefault();
    shell.openExternal(this.props.shotUrl);
  },
  render: function() {
    return (
      <li className="shot-wrapper">
        <div className="shot">
          <img className="shot-image" key={this.props.id} src={this.props.imageUrl} />
          <h2 className="shot-title">
            <a onClick={this.onTitleClick} href={this.props.shotUrl}>{this.props.title}</a>
          </h2>
          <p className="shot-likes">
            <img className="heart-icon" src="assets/heart.svg" />{this.props.likes_count}
          </p>
        </div>
{/*}    <div className="attribution">
          <p className="shot-author"><img src={this.props.avatar_url} />{this.props.author}</p>
        </div>
*/}
      </li>
    );
  }
})

var ShotList = React.createClass({
  render: function() {
    var shotNodes = this.props.data.map(function (shot){
      return (
        <Shot key={shot.id} title={shot.title} shotUrl={shot.html_url}
        author={shot.user.name} avatar_url={shot.user.avatar_url}
        likes_count={shot.likes_count} description={shot.description}
        imageUrl={shot.animated && shot.images.hidpi ? shot.images.hidpi : shot.images.normal} />
      );
    });
    return (
      <ul className="shot-list">
        {shotNodes}
      </ul>
    );
  }
});

var ShotBox = React.createClass({
  getDataFromDribbble: function() {
    console.log("Getting data from dribbble");
    request(buildOptions(pageIndex, perPage), function(error, response, body) {
      if(!error && response.statusCode == 200) {
        var dribbbleJSONData = JSON.parse(body);
        this.setState({data: dribbbleJSONData});
      }
    }.bind(this))
  },
  getInitialState: function() {
    pageIndex: 1;
    return {data: []};
  },
  componentDidMount: function() {
    this.getDataFromDribbble();
    setInterval(function() {
      this.getDataFromDribbble();
    }.bind(this), 900000); // 15min refresh timer
  },
  render: function() {
    return (
      <div className="shot-box">
        <ShotList data={this.state.data} />
      </div>
    );
  }
});

// Render out ShotBox to html attaching to #main
ReactDOM.render(
  <ShotBox />,
  document.getElementById('main')
);







// Scroll Handeling
// Setup handler for scroll-to-top button
var didScroll;
var lastScrollTop = 0;
var delta = 10;
var scrollButton = document.querySelector('.scroll-to-top');
var siteHeader = document.querySelector('.site-header');
var buttonHeight = scrollButton.clientHeight;
var buttonIsUp = false;
var windowHeight = window.innerHeight;
var nearTop = true;

document.onscroll = function() {
  didScroll = true;
};

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);


function hasScrolled() {
  var st = document.body.scrollTop;
  if (Math.abs(lastScrollTop - st) <= delta){
    return;
  }

  if (st < windowHeight) {
    nearTop = true;
  } else {
    nearTop = false;
  }

  if (st > lastScrollTop) { // Scrolled up
    siteHeader.classList.remove('header-down');
    siteHeader.classList.add('header-up');
  }

  if (st < lastScrollTop) {
    siteHeader.classList.remove('header-up');
    siteHeader.classList.add('header-down');
  }

  // Special condition to delay appearence of item and hide when near the top
  if (buttonIsUp && nearTop) {
    scrollButton.classList.remove('button-up');
    scrollButton.classList.add('button-down');
    console.log('scrolling up near the top');
    buttonIsUp = false;
  }

  if (st > lastScrollTop && buttonIsUp) { // Scrolled Down
    scrollButton.classList.remove('button-up');
    scrollButton.classList.add('button-down');

    console.log('scrolling down');
    buttonIsUp = false;
  } else if (st < lastScrollTop && !buttonIsUp && !nearTop) { // Scrolled up
    scrollButton.classList.remove('button-down');
    scrollButton.classList.add('button-up');
    console.log('scrolling up');
    buttonIsUp = true;
  }

  lastScrollTop = st;
}


// Off canvas menu handling

document.getElementById('quit-button').addEventListener('click', function() {
  ipc.send('quit-button-clicked');
})


document.getElementById('show-settings-button').addEventListener('click', function() {
  this.blur();
  displayOffCanvasMenu();
});

document.getElementById('main').addEventListener('click', function() {
  if (document.querySelector('.site-header').classList.contains('settings-visible')) {
    displayOffCanvasMenu();
  }
});

function displayOffCanvasMenu() {
  swapClasses('.site-header-settings', 'settings-hidden', 'settings-visible');
  swapClasses('.site-header', 'settings-hidden', 'settings-visible');

  //  Prevent scroll when settings are open
  if (document.body.classList.contains('body-locked')){
    document.body.classList.remove('body-locked');
  } else {
    document.body.classList.add('body-locked');
  }
}


// utility function
function swapClasses(element, class1, class2) {
  var element = document.querySelector(element);
  if (element.classList.contains(class1)) {
    element.classList.remove(class1);
    element.classList.add(class2);
  } else {
    element.classList.remove(class2);
    element.classList.add(class1);
  }
}




// Scroll to top animation and handler

document.querySelector('.scroll-to-top').onclick = function () {
  animateScrollTo(document.body, 0, 1250);
  scrollButton.blur();
}

//document.querySelector('.site-header').onclick = function() {
//  animateScrollTo(document.body, 0, 1250);
//}

function animateScrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
