const userDetails = document.querySelector(".userDetails");
const editUserProfile = document.querySelector("#edit-profile");

async function CreateUserCollection(user) {
  await firebase.firestore().collection("users").doc(user.uid).set({
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    phone: "",
    speciality: "",
    portfolioUrl: "",
    experience: "",
  });
}

async function getUserInfo(userId) {
  console.log(userId);
  if (userId) {
    const userInfoSnapshot = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    const userInfo = userInfoSnapshot.data();
    console.log(userInfo);
    if (userInfo) {
      userDetails.innerHTML = `
        <h3>${userInfo.name}</h3>
        <h3>${userInfo.email}</h3>
        <h3>${userInfo.phone}</h3>
    `;
    }
  } else {
    userDetails.innerHTML = `
    <h3>please login</h3>
`;
  }
}

function getUserInfoRealTime(userId) {
  if (userId) {
    const userInfoDocRef = firebase.firestore().collection("users").doc(userId);
    userInfoDocRef.onSnapshot((doc) => {
      if (doc.exists) {
        const userInfo = doc.data();
        console.log(userInfo);
        if (userInfo) {
          userDetails.innerHTML = `
          <ul class="collection">
      <li class="collection-item"><h1>${userInfo.name?userInfo.name:"user"}</h1></li>
      <li class="collection-item">${userInfo.email}</li>
      <li class="collection-item">${userInfo.phone}</li>
      <li class="collection-item">${userInfo.speciality}</li>
      <li class="collection-item">${userInfo.experience}</li>
    </ul>
    <a href="${userInfo.portfolioUrl}" class="btn" target="_blank">visit my portfolio</a>
        <button class="btn waves-effect #283593 indigo darken-3 modal-trigger" href="#modal3">Edit profile</button>
    `;
          editUserProfile["name"].value = userInfo.name;
          editUserProfile["profileEmail"].value = userInfo.email;
          editUserProfile["phone"].value = userInfo.phone;
          editUserProfile["speciality"].value = userInfo.speciality;
          editUserProfile["portfolioUrl"].value = userInfo.portfolioUrl;
          editUserProfile["experience"].value = userInfo.experience;
          if (firebase.auth().currentUser.photoURL) {
            document.querySelector("#profileImg").src =
              firebase.auth().currentUser.photoURL;
            console.log(document.querySelector("#profileImg").src);
          }
        }
      }
    });
  } else {
    userDetails.innerHTML = `
    <h3>please login</h3>
`;
  }
}
async function updateUserProfile(e) {
  e.preventDefault();
  const userDocRef = await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid);
  userDocRef.update({
    name: editUserProfile["name"].value,
    email: editUserProfile["profileEmail"].value,
    phone: editUserProfile["phone"].value,
    speciality: editUserProfile["speciality"].value,
    portfolioUrl: editUserProfile["portfolioUrl"].value,
    experience: editUserProfile["experience"].value,
  });
  M.Modal.getInstance(myModel[2]).close();
}

function uploadImage(e) {
  const uid = firebase.auth().currentUser.uid;
  const filesRef = firebase.storage().ref().child(`/users/${uid}/profile`);
  const uploadTask = filesRef.put(e.target.files[0]);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      if (progress === 100) {
        // Upload completed, get the download URL
        alert("uploaded");
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        document.querySelector("#profileImg").src = downloadURL;
        firebase
          .auth()
          .currentUser.updateProfile({
            photoURL: downloadURL,
          })
          .then(() => {
            console.log("User profile updated with photoURL");
          })
          .catch((error) => {
            console.error("Error updating user profile:", error);
          });
        // alert("Profile is successfully uploaded");
      });
    }
  );
}

function getAllUserDetails(){
  document.querySelector('#table').style.display = 'table'
  const usersRef = firebase.firestore().collection('users')
  usersRef.onSnapshot(querySnap => {
    // console.log(querySnap);
    querySnap.docs.forEach(doc => {
      const info = doc.data()
      // console.log(info);
      if(firebase.auth().currentUser.uid !== info.uid){
        document.querySelector('#tbody').innerHTML += `
      <tr>
        <td>${info.name}</td>
        <td>${info.email}</td>
        <td>${info.phone}</td>
        <td>${info.speciality}</td>
        <td>${info.experience}</td>
        <td><a href="${info.portfolioUrl}" class="btn" target="_blank">visit</a></td>
      </tr>
      `
      }
    })
  })
}