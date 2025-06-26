<template>
  <!-- The form uses @submit.prevent to capture the form submission event and execute the "handleSubmit" function. -->
  <div>
    <h1 class="text-center text-uppercase">cform</h1>
    <form @submit.prevent="handleSubmit">
      <div class="field-container">
        <!-- Input field for name -->
        <label for="name" class="txtFieldName">Name:</label>
        <input id="name" v-model="form.name" type="text" placeholder="Insert your name" />
        <!-- Display an error message if the name field doesn't pass the validations defined in "rules" -->
        <span v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
      </div>
      <div class="field-container">
        <!-- Input field for email -->
        <label for="email">Email:</label>
        <input id="email" v-model="form.email" type="text" placeholder="Insert your email" />
        <!-- Display an error message if the email field doesn't pass the validations defined in "rules" -->
        <span v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
      </div>
      <div class="field-container">
        <!-- Input field for password -->
        <label for="password">Password:</label>
        <input id="password" v-model="form.password" type="password" placeholder="Insert your password" />
        <!-- Display an error message if the password field doesn't pass the validations defined in "rules" -->
        <span v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</span>
      </div>
      <div class="field-container">
        <!-- Input field for confirming the password -->
        <input v-model="form.confirmPassword" type="password" placeholder="Confirm password" />
        <!-- Display an error message if the password confirmation field doesn't pass the validations defined in "rules" -->
        <span v-if="v$.confirmPassword.$error">{{ v$.confirmPassword.$errors[0].$message }}</span>
      </div>
      <!-- Button to submit the form -->
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required, sameAs } from '@vuelidate/validators'
import { computed, reactive } from 'vue'
// Create a reactive "form" object to store the values of the form fields
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
// Define validation rules for each form field using "computed"
const rules = computed(() => {
  return {
    name: { required }, // Name is required
    email: {
      required, // Email is required
      email, // Must be a valid email address
    },
    password: {
      required, // Password is required
      minLength: minLength(8), // Password must have at least 8 characters
    },
    confirmPassword: {
      required, // Password confirmation is required
      sameAs: sameAs(form.password), // Must match the value of the entered password
    },
  }
})
// Use the "useVuelidate" function to perform form validation
const v$ = useVuelidate(rules, form)

// Function to handle form submission
async function handleSubmit() {
  // Validate the form fields
  const result = await v$.value.$validate()

  if (!result) {
    // If there are errors in the form, show an alert indicating that the form is invalid
    alert('The form has errors')

    return
  }
  // If the form is valid, perform some action with the form data
  alert('Form submitted successfully')
}
</script>

<style lang="css">
.txtFieldName {
  color: red;
  font-size: 20px;
}

form {
  width: 400px;
  margin: 0 auto;
  background-color: #f1f1f1;
  padding: 30px;
  border-radius: 20px;
}

div.field-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  height: 118px;
}

label {
  text-align: left;
}

input {
  display: block;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-bottom: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1em;
  padding: 20px;
  margin: 10px 0 5px 0;
  width: 100%;
}

span {
  color: red;
  font-size: 0.8em;
  text-align: left;
}

button {
  background-color: #3498db;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  color: white;
}
</style>
