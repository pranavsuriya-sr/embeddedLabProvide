// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
// import { getDatabase, ref, push, get, update, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { initializeApp} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, push, get, update, set} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDsmGooNCbVlQY-KZE9-YIhGhXTTUfnKy4",
    authDomain: "appntapp-2d799.firebaseapp.com",
    projectId: "appntapp-2d799",
    storageBucket: "appntapp-2d799.appspot.com",
    messagingSenderId: "740407693598",
    appId: "1:740407693598:web:cf495254e20b2ac93ff90f",
    measurementId: "G-Q53J0PGR4Y"
  };
  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app);
  

  
  const form1 = document.getElementById("contactForm1");
  const r1Input = document.getElementById("rollNo");
  const cmp1Input = document.getElementById("cmp");
  const cmpn1Input = document.getElementById("cmpn");
  const date1Input = document.getElementById("date");
  const degree1Input = document.getElementById("degree");
  const sem1Input = document.getElementById("sem");
  const branch1Input = document.getElementById("branch");
  
  form1.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Get values from the form
    const r1 = r1Input.value;
    const cmp1 = cmp1Input.value;
    const cmpn1 = cmpn1Input.value;
    const date1 = date1Input.value;
    const deg1 = degree1Input.value;
    const sem1 = sem1Input.value;
    const branch1 = branch1Input.value;
  
   
    
  
    try {
      const componentsRef = ref(database, 'components');
      const componentsSnapshot = await get(componentsRef);
      const componentsData = componentsSnapshot.val();
    
      if (componentsData) {
        // Iterate through each key-value pair in componentsData
        for (const [key, app] of Object.entries(componentsData)) {
          if (app.Component_Name === cmp1 && app.Component_Quantity >= parseInt(cmpn1)) {
            const appointmentsRef = ref(database, 'appointments');
            push(appointmentsRef, {
              Roll_No: r1,
              Cmp: cmp1,
              Cmpn: cmpn1,
              gotdate: date1,
              degree: deg1,
              sem: sem1,
              branch: branch1,
              sentdate: "Not_Returned_Still"
            }).then(() => {
              // Update the quantity of components in the database
              const componentUpdate = {};
              componentUpdate[`${key}/Component_Quantity`] = app.Component_Quantity - parseInt(cmpn1);
              update(componentsRef, componentUpdate);
    
              alert("Components Provided");
              // further actions or UI updates here
            }).catch((error) => {
              // Handle errors
              alert("Error pushing data: " + error);
            });
    
            // Clear the form fields
            r1Input.value = '';
            cmp1Input.value = '';
            cmpn1Input.value = '';
            date1Input.value = '';
            degree1Input.value = '';
            sem1Input.value = '';
            branch1Input.value = '';
    
            // Break out of the loop after finding the matching component
            break;
          }
          else{
            alert("Requested components are not available or not enough");
          }
        }
    
    
      } else {
        alert("Requested components are not available or not enough");
      }
    } catch (error) {
      // Handle errors if data retrieval fails
      alert("Requested components are not available or not enough");
    }
    
  })
  

// ...
// Reference to the second form and its elements
const form2 = document.getElementById("contactForm2");
const r2Input = document.getElementById("rl2");
const appointmentDetailsText = document.getElementById("appointmentDetailsText");
const sem2Input = document.getElementById("sem2");
const degree2Input = document.getElementById("degree2");
const branch2Input = document.getElementById("branch2");

form2.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const r2 = r2Input.value;
  const sem2 = sem2Input.value;
  const deg2 = degree2Input.value;
  const branch2 = branch2Input.value;

  const appointmentsRef = ref(database, 'appointments');

  try {
    const snapshot = await get(appointmentsRef);
    const appointments = snapshot.val();

    if (appointments) {
      const filteredAppointments = Object.values(appointments).reverse().filter(
        (app) => app.Roll_No === r2 && app.sem === sem2 && app.degree === deg2 && app.branch === branch2
      );

      if (filteredAppointments.length > 0) {
        // Display the components once
        appointmentDetailsText.textContent = `Degree : ${filteredAppointments[0].degree}, Sem : ${filteredAppointments[0].sem}, Branch : ${filteredAppointments[0].branch}, Roll No: ${filteredAppointments[0].Roll_No}\n`;

        // Display all matching entries
        filteredAppointments.forEach(appointment => {
          appointmentDetailsText1.textContent += `Component: ${appointment.Cmp}, Number of Components: ${appointment.Cmpn}\n`;
          appointmentDetailsText2.textContent += `Date: ${appointment.gotdate}, Return: ${appointment.sentdate}\n\n`;
        });
      } else {
        appointmentDetailsText.textContent = "Data not found for the specified Roll No.";
        appointmentDetailsText1.textContent = `Component: NULL, NULL`;
        appointmentDetailsText2.textContent = `Date: NULL, Return: NULL`;
      }
    } else {
      appointmentDetailsText.textContent = "No data available.";
      appointmentDetailsText1.textContent = `Component: NULL, NULL`;
      appointmentDetailsText2.textContent = `Date: NULL, Return: NULL`;
    }
  } catch (error) {
    // Handle errors if data retrieval fails
    appointmentDetailsText.textContent = "Error retrieving student data: " + error;
    appointmentDetailsText1.textContent = `Component: NULL, NULL`;
    appointmentDetailsText2.textContent = `Date: NULL, Return: NULL`;
  }

  // Clear the form field
  r2Input.value = '';
  sem2Input.value = '';
  degree2Input.value = '';
  branch2Input.value = '';
});


// const componentsRef = ref(database, 'components');


// // Call the function to populate the dropdown list on page load
// function populateComponentsDropdown() {
//   componentsRef.once('value', function(snapshot) {
//     const componentsDropdown = document.getElementById('componentsDropdown');
//     componentsDropdown.innerHTML = '<option value="" disabled selected>Select Component</option>';

//     snapshot.forEach(function(childSnapshot) {
//       const key = childSnapshot.key; // This is the key of the component
//       const component = childSnapshot.val(); // This should contain the component's details
//       componentsDropdown.innerHTML += `<option value="${key}">${component}</option>`;
//     });
//   });
// }
// // Call the function to populate the dropdown list on page load
// populateComponentsDropdown();