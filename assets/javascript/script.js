var firebaseConfig = {
    authDomain: "myportfolio-c42aa.firebaseapp.com",
    databaseURL: "https://myportfolio-c42aa.firebaseio.com",
    projectId: "myportfolio-c42aa",
    messagingSenderId: "389038542094",
    appId: "1:389038542094:web:25a3352f4bda4e7d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  var portfolioRef = database.ref('portfolio');


$( document ).ready(function() {

    portfolioDisplay = $("#portfolio-display");
    featuredDisplay = $("#featured-display");

    portfolioRef.once('value').then(snapshot => {
        snapshot.forEach( childSnap => {
            if (childSnap.val().featured) {
                var titleDiv = $("<div>");
                var myImg = $("<img>");
                var myLink = $("<a>");

                myImg.attr('src', childSnap.val().image);
                myImg.addClass('featured-img m-2');

                titleDiv.addClass('my-title');
                titleDiv.html('<h2>' + childSnap.val().title + '</h2>');

                myLink.attr('href', childSnap.val().theURL);
                myLink.append(myImg, titleDiv);

                featuredDisplay.append(myLink);
            }
            else {
                var myDiv = $("<div>");
                var titleDiv = $("<div>");
                var myImg = $("<img>");
                var myLink = $("<a>");

                myImg.attr('src', childSnap.val().image);
                myImg.addClass('regular-img m-2');

                titleDiv.addClass('my-title');
                titleDiv.html('<h4>' + childSnap.val().title + '</h4>');

                myLink.attr('href', childSnap.val().theURL);
                myLink.append(myImg, titleDiv);

                myDiv.addClass('col-xl-3 col-lg-4 col-md-6 text-center');
                myDiv.append(myLink);

                portfolioDisplay.append(myDiv);
            }
        });
    });
});
