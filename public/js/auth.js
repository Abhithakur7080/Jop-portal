const myModel = document.querySelectorAll(".modal");

async function signup(e) {
  e.preventDefault();
  const email = document.querySelector("#signupEmail");
  const password = document.querySelector("#signupPassword");
  // console.log(email.value, password.value);
  if(!email.value.length || !password.value.length){
    return M.toast({ html: "Please enter all fields!", classes: "red" });
  }
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value);
      await result.user.updateProfile({
        displayName: "user"
      })
      // await result.user.sendEmailVerification()
      CreateUserCollection(result.user)
    M.toast({ html: `Welcome ${result.user.email}`, classes: "green" });
    // console.log(result);
  } catch (error) {
    // console.error(error);
    M.toast({ html: error.message, classes: "red" });
  }
  email.value = "";
  password.value = "";
  M.Modal.getInstance(myModel[0]).close();
}

async function login(e) {
  e.preventDefault();
  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");
  // console.log(email.value, password.value);
  if(!email.value.length || !password.value.length){
    return M.toast({ html: "Please enter all fields!", classes: "red" });
  }
  try {
    const result = await firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value);
    M.toast({ html: `Welcome ${result.user.email}`, classes: "green" });
    console.log(result);
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      M.toast({ html: "Incorrect Email/Password", classes: "red" });
    } else {
      M.toast({ html: "Something Went Wrong!", classes: "red" });
    }
  }
  email.value = "";
  password.value = "";
  M.Modal.getInstance(myModel[1]).close();
}

async function logout() {
  try {
    await firebase.auth().signOut();
    document.querySelector('#profileImg').src = './user.png'
    document.querySelector('#table').style.display = 'none'
    M.toast({ html: `user logout successfully`, classes: "green" });
  } catch (error) {
    console.error(error.message);
  }
}

async function loginwithGoogle() {
  try {
    let provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    CreateUserCollection(result.user)
    M.Modal.getInstance(myModel[0]).close();
    M.Modal.getInstance(myModel[1]).close();
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
}

async function loginwithFacebook() {
    try {
        var provider = new firebase.auth.FacebookAuthProvider();
        console.log(provider);
      const result = await firebase.auth().signInWithPopup(provider);
      console.log(result);
      M.Modal.getInstance(myModel[0]).close();
      M.Modal.getInstance(myModel[1]).close();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }

//if user already logged in then set the user
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log(user);
    // getUserInfo(user.uid)
    document.querySelector('#login').style.display = 'none'
    document.querySelector('#signup').style.display = 'none'
    document.querySelector('#logout').style.display = 'block'
    getUserInfoRealTime(user.uid)
    if(user.uid=='CgODvg15loXl217Y3nvpItZZeec2'){
      getAllUserDetails()
    }
    console.log(user);
  } else {
    document.querySelector('#login').style.display = 'block'
    document.querySelector('#signup').style.display = 'block'
    document.querySelector('#logout').style.display = 'none'
    getUserInfo(null)
    console.log("Signout success");
    M.toast({
      html: `User not logged in please signup/register user`,
      classes: "green",
    });
  }
});
//similar
/*
const user = firebase.auth().currentUser;
if (user) {
  console.log(user);
} else {
  console.log("Signout success");
  M.toast({
    html: `User not logged in please signup/register user`,
    classes: "green",
  });
}
*/

// unsubscribe() // for code clean up






















  //not to be use
  /*
  rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
   */