import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router/router'
import {logger, alertWarn} from "@/misc.js";

const state = {
  applications: null
}
const getters = {
  application: (state) => (userID, applicationID) => {
    return state.applications.find(application => (application.userID === userID) && (application.id === applicationID))
  },
  applications: (state) => {
    return state.applications;
  },
  applicationsFromUser: (state) => (userID) => {
    let applications = [];
    state.applications.forEach(application => {
      if (application.userID === userID) {
        applications.push(application);
      }
    })
    return applications;
  },
}

const actions = {
  async submit17thApplication({commit}, [steamURL, age, timezone, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]) {
    if (firebase.auth().currentUser) {
      const interestedRoles = []
      if (ranger) {
        interestedRoles.push('Ranger')
      }
      if (medic) {
        interestedRoles.push('Medic')
      }
      if (sapper) {
        interestedRoles.push('Sapper')
      }
      if (pilot) {
        interestedRoles.push('Pilot')
      }
      if (tank_crew) {
        interestedRoles.push('Tank Crew')
      }
      if (idf) {
        interestedRoles.push('IDF Support')
      }
      const application = {
        steamURL,
        age,
        timezone,
        arma3Hours,
        hobbies,
        whyJoin,
        attractmilsim,
        attendOps,
        interestedRoles,
        status: 'Waiting',
        comment: "",
        userID: firebase.auth().currentUser.uid,
        division: "17th",
        date: firebase.firestore.Timestamp.now()
      }
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection("applications").doc().set(application).then(async () => {
        logger.log({
          level: "info",
          message: "New Application created",
          isLoggedIn: true,
          division: "17th",
          userID: firebase.auth().currentUser.uid,
        })
        await router.push('/user/applications')
      }).catch(error => {
        if(error) {
          logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            division: "17th",
            userID: firebase.auth().currentUser.uid
          })
          alertWarn(0)
        }
      })
    }
  },

  async submitIcebergApplication({commit}, [steamURL, age, hoursInGamesTheyJoinFor, hobbies, areYouInAnyCommunities, whereDidYouHearUsFrom, gamesTheyJoinFor, whyJoin]) {
    if (firebase.auth().currentUser) {
      const application = {
        steamURL,
        age,
        hoursInGamesTheyJoinFor,
        hobbies,
        areYouInAnyCommunities,
        whereDidYouHearUsFrom,
        gamesTheyJoinFor,
        whyJoin,
        status: "Waiting",
        comment: "",
        userID: firebase.auth().currentUser.uid,
        division: "Iceberg",
        date: firebase.firestore.Timestamp.now()
      }
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("applications").doc().set(application).then(async () => {
        logger.log({
          level: "info",
          message: "New Application created",
          isLoggedIn: true,
          division: "Iceberg",
          userID: firebase.auth().currentUser.uid,
        })
        await router.push('/user/applications')
      }).catch(error => {
        if(error) {
          logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            division: "Iceberg",
            userID: firebase.auth().currentUser.uid
          })
          alertWarn(0);
        }
      })
    }
  },

  async fetchApplications({commit}) {
    const newApplications = []
    await firebase.firestore().collection('users').get().then(async users => {
      for (let i = 0; i < users.docs.length; i++) {
        let user = users.docs[i];
        await firebase.firestore().collection('users').doc(user.id).collection('applications').get().then(async applications => {
          for (const application of applications.docs) {
            const object = {...application.data(), id: application.id}
            newApplications.unshift(object);
          }
        }).catch(error => {
          if(error) {
            logger.log({
              level: "alert",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID: firebase.auth().currentUser.uid
            })
            alertWarn(0);
          }
        })
      }
      logger.log({
        level: "info",
        message: "Fetched Applications",
        isLoggedIn: true,
        userID: firebase.auth().currentUser.uid,
      })
    }).catch(error => {
      if(error) {
        logger.log({
          level: "alert",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: firebase.auth().currentUser.uid,
        })
        alertWarn(o)
      }
    })

    commit("setApplications", newApplications);
  },

  async changeApplicationStatus({commit}, [newStatus, userID, applicationID, division]) {
    if (firebase.auth().currentUser) {
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.data().roles.includes("[ICE] Recruiter")) {
          let newComment = "";

          if (division === "17th") {
            if (newStatus.toLowerCase() === "processing") {
              newComment = "Your application is currently being held for processing. When you're able to, we request that we interview you(nothing bad!) and that you hop on to the TeamSpeak (ts.iceberg-gaming.com) to reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here."
            } else if (newStatus.toLowerCase() === "accepted") {
              newComment = "Congrats! Your application to the 17th Brigade Combat Team has been accepted! It is our great pleasure to welcome you to the community. " +
                "There are only a couple of things to take care of in order to join us on the battlefield. First we request that you subscribe our shadow mod. You can subscribe to our shadow mod here: " +
                "https://steamcommunity.com/sharedfiles/filedetails/?id=1501538330" +
                " . Second, we request that you hop on the Teamspeak (ts.iceberg-gaming.com) and message a Corporal(CPL) or above to get your roles. If nobody is available, make sure you post it in general chat on our Discord." +
                " Last but not least, we ask that you familiarize yourself with our Code of Conduct, Ranks, and Structure Pages. If you happen to have any questions please feel free to ask around. Until then, we'll see you soon!"
              await this.dispatch("acceptUser", [userID, division]);
            } else if (newStatus.toLowerCase() === "denied") {
              newComment = "We have reviewed your application and we thank you for your interest in the 17th Brigade Combat Team. However, unfortunately we were unable to accept your application at this time. You may inquire about why your application was declined." +
                " You are free to resubmit your application in the future at any time. We are sorry about the inconvenience.";
            }

            await firebase.firestore().collection("users").doc(userID).collection("applications").doc(applicationID).update({
              status: newStatus,
              comment: newComment
            }).then(async () => {
              console.log("updated");
              logger.log({
                level: "info",
                message: "Application Status Changed",
                recruiter: firebase.auth().currentUser.uid,
                isLoggedIn: true,
                userID,
                applicationID,
                division,
                newStatus
              })
            }).catch(error => {
              if(error) {
                logger.log({
                  level: "alert",
                  message: error.message,
                  stack: error.stack,
                  recruiter: firebase.auth().currentUser.uid,
                  isLoggedIn: true,
                  userID,
                  applicationID,
                  division,
                  newStatus
                })
                alertWarn(0)
              }
            })
          } else if (division === "Iceberg") {
            if (newStatus.toLowerCase() === "processing") {
              newComment = "Your application is currently being held for processing. When you're able to, we request that we interview you(nothing bad!) and that you hop on to the TeamSpeak (ts.iceberg-gaming.com) to reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.";
            } else if (newStatus.toLowerCase() === "accepted") {
              newComment = "";
              await this.dispatch("acceptUser", [userID, division]);
            } else if (newStatus.toLowerCase() === "denied") {
              newComment = "We have reviewed your application and we thank you for your interest in Iceberg Gaming. However, unfortunately we were unable to accept your application at this time. You may inquire about why your application was declined." +
                " You are free to resubmit your application in the future at any time. We are sorry about the inconvenience.";
            }

            await firebase.firestore().collection("users").doc(userID).collection("applications").doc(applicationID).update({
              status: newStatus,
              comment: newComment
            }).then(async () => {
              logger.log({
                level: "info",
                message: "Application Status Changed",
                recruiter: firebase.auth().currentUser.uid,
                isLoggedIn: true,
                userID,
                applicationID,
                division,
                newStatus
              })
            }).catch(error => {
              if(error) {
                logger.log({
                  level: "alert",
                  message: error.message,
                  stack: error.stack,
                  recruiter: firebase.auth().currentUser.uid,
                  isLoggedIn: true,
                  userID,
                  applicationID,
                  division,
                  newStatus
                })
                alertWarn(0)
              }
            })
          }
        }
      })
    }
  }

}

const mutations = {
  setApplications(state, applications) {
    state.applications = applications
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
