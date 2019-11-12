// Set up the Firebase database
const firebaseConfig = {
    authDomain: "myportfolio-c42aa.firebaseapp.com",
    databaseURL: "https://myportfolio-c42aa.firebaseio.com",
    projectId: "myportfolio-c42aa",
    messagingSenderId: "389038542094",
    appId: "1:389038542094:web:25a3352f4bda4e7d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // set up our page state variable
  let state = {
      loggedIn: '',
  }

  $( document ).ready(function() {
    const loginSubmit = $("#login-submit");
    const passwordText = $("#the-password");
    const loginForm = $("#login-form");
    const logoutButton = $("#logout");
    const someButtons = $(".function-buttons");
    const addNewButton = $("#add-item")
    const portfolioTable = $("#portfolio-table");
    const addNewItemForm = $("#add-new-item-form");
    const submitNewItem = $("#new-portfolio-item");
    const editItemForm = $("#edit-item-form");
    const closeEdit = $("#close-edit")
    const editFormData =  $("#edit-data-key")
    const editFormTitle = $("#edit-title")
    const editFormImage = $("#edit-image")
    const editFormUrl = $("#edit-url")
    const editFormFeatured = $("#edit-featured")
    const saveChangesButton = $("#save-changes")
    const closeNewPortfolioButton = $("#new-portfolio-close")


    database.ref('loggedIn').once('value').then(snapshot => {
        if (snapshot.val() === 'true') {
            doLogin();
        }
    });

    loginSubmit.on('click', function() {
        event.preventDefault();
        let temp = passwordText.val();
        database.ref('password').once('value').then(snapshot => {
            if (temp === snapshot.val() ) {
                passwordText.val('');
                doLogin();
            }
            else {
                passwordText.val('');
            }
        });
    })

    logoutButton.on('click', () => {
        state.loggedIn = false;
        portfolioTable.hide();
        someButtons.hide();
        loginForm.show();
        portfolioTable.empty();
        addNewItemForm.hide();
        database.ref('loggedIn').set('false');
    })

    addNewButton.on('click', () => {
        addNewItemForm.show();
    });

    submitNewItem.on('click', () => {
        event.preventDefault();
        let newProject = {};
        newProject.title = $("#portfolio-title").val().trim();
        newProject.image = $("#portfolio-image").val().trim();
        newProject.theURL = $("#portfolio-url").val().trim();
        newProject.featured = $("#portfolio-featured").prop('checked');
         
        database.ref('portfolio').push(newProject);

        $("#portfolio-title").val('')
        $("#portfolio-image").val('')
        $("#portfolio-url").val('')
        addNewItemForm.hide()
    })

    closeNewPortfolioButton.on('click', () => {
        event.preventDefault();
        $("#portfolio-title").val('')
        $("#portfolio-image").val('')
        $("#portfolio-url").val('')
        addNewItemForm.hide()
    })

    $(document).on('click', '.edit-portfolio-item', function() {
        let temp = $(this).attr('data-key')
        const portfolioRef = database.ref('portfolio');
        portfolioRef.once('value').then(snapshot => {
            console.log(snapshot.child(temp).child('featured').val()) 
            editFormData.val(temp);
            editFormTitle.val(snapshot.child(temp).child('title').val())
            editFormImage.val(snapshot.child(temp).child('image').val())
            editFormUrl.val(snapshot.child(temp).child('theURL').val())
            if (snapshot.child(temp).child('featured').val()) {
                editFormFeatured.prop('checked', true)
            }
            else {
                editFormFeatured.prop('checked', false)
            }
        })
        editItemForm.show();
    });

    saveChangesButton.on('click', function() {
        event.preventDefault();
        let keyToChange = $("#edit-data-key").val()
        let changedProject = {};
        changedProject.title = editFormTitle.val().trim()
        changedProject.image = editFormImage.val().trim()
        changedProject.theURL = editFormUrl.val().trim()
        changedProject.featured = $("#edit-featured").prop('checked')
        database.ref('portfolio').child(keyToChange).set(changedProject);
        displayPortfolio();
        editFormData.val('')
        editFormTitle.val('')
        editFormImage.val('')
        editFormUrl.val('')
        editItemForm.hide()
    })

    closeEdit.on('click', () => {
        event.preventDefault()
        editFormData.val('')
        editFormTitle.val('')
        editFormImage.val('')
        editFormUrl.val('')
        editItemForm.hide()
    })
    
    $(document).on('click', '.delete-portfolio-item', function() {
        let keyToRemove = $(this).attr('data-key');
        console.log('delete key ' + keyToRemove);
        database.ref('portfolio').child(keyToRemove).remove();
        displayPortfolio()
    });

    const doLogin = () => {
        state.loggedIn = true;
        loginForm.hide();
        someButtons.show();
        displayPortfolio();
        portfolioTable.show();
        database.ref('loggedIn').set('true');
        // getStatus();
    }

// end of document.ready function for DOM manipulation
  }); 

  const displayPortfolio = () => {
    const portfolioList = $("#portfolio-list");
    const portfolioRef = database.ref('portfolio');

    portfolioList.empty();

    portfolioRef.once('value').then(snapshot => {
        snapshot.forEach(childSnap => {
            let newRow = $("<tr>");
            let tempCell = $("<td>");
            let editButton = $("<button>");
            let deleteButton = $("<button>");
            
            tempCell.text(childSnap.val().title);
            newRow.append(tempCell);
            tempCell = $("<td>");

            tempCell.text(childSnap.val().image);
            newRow.append(tempCell);
            tempCell = $("<td>");

            tempCell.text(childSnap.val().theURL);
            newRow.append(tempCell);
            tempCell = $("<td>");

            tempCell.text(childSnap.val().featured);
            newRow.append(tempCell);
            tempCell = $("<td>");

            editButton.text('Edit');
            editButton.addClass('btn btn-secondary edit-portfolio-item p-1');
            editButton.attr('data-key', childSnap.key);
            tempCell.append(editButton);
            newRow.append(tempCell);
            tempCell = $("<td>");

            deleteButton.text('Delete');
            deleteButton.addClass('btn btn-danger delete-portfolio-item p-1');
            deleteButton.attr('data-key', childSnap.key);
            tempCell.append(deleteButton);
            newRow.append(tempCell);

            portfolioList.append(newRow);
        });
    });
  }

database.ref('portfolio').on("child_added", snapshot => {
    const portfolioList = $("#portfolio-list");
    let newRow = $("<tr>");
    let tempCell = $("<td>");
    let editButton = $("<button>");
    let deleteButton = $("<button>");
    
    tempCell.text(snapshot.val().title);
    newRow.append(tempCell);
    tempCell = $("<td>");

    tempCell.text(snapshot.val().image);
    newRow.append(tempCell);
    tempCell = $("<td>");

    tempCell.text(snapshot.val().theURL);
    newRow.append(tempCell);
    tempCell = $("<td>");

    tempCell.text(snapshot.val().featured);
    newRow.append(tempCell);
    tempCell = $("<td>");

    editButton.text('Edit');
    editButton.addClass('btn btn-secondary edit-portfolio-item p-1');
    editButton.attr('data-key', snapshot.key);
    tempCell.append(editButton);
    newRow.append(tempCell);
    tempCell = $("<td>");
    
    deleteButton.text('Delete');
    deleteButton.addClass('btn btn-danger delete-portfolio-item p-1');
    deleteButton.attr('data-key', snapshot.key);
    tempCell.append(deleteButton);
    newRow.append(tempCell);

    portfolioList.append(newRow);
});