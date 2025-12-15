// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOIFiXApmG7MajWwadM9igftbtxmymFwY",
  authDomain: "pins-and-stocking.firebaseapp.com",
  projectId: "pins-and-stocking",
  storageBucket: "pins-and-stocking.firebasestorage.app",
  messagingSenderId: "301061588372",
  appId: "1:301061588372:web:f41bfb6ef5b97c88c73b81"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const db = firebase.firestore();
const auth = firebase.auth();