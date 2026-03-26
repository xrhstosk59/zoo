// ekdilosi.js
import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';

const ekdilosiFields = [
    { name: 'titlos', label: 'Τίτλος', required: true, type: 'text' },
    { name: 'hmerominia', label: 'Ημερομηνία', required: true, type: 'date',
      min: new Date().toISOString().split('T')[0] },
    { name: 'ora', label: 'Ώρα', required: true, type: 'time', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
    { name: 'xwros', label: 'Χώρος', required: true, type: 'text' }
 ];

function createEkdilosiForm(formType, data = null) {
   const form = document.createElement('form');
   form.className = 'entity-form';
   form.addEventListener('submit', async (e) => handleEkdilosiSubmit(e, formType));

   const title = document.createElement('h2');
   title.textContent = `${formType} Εκδήλωσης`;
   form.appendChild(title);

   if (formType === 'Επεξεργασία' && data) {
       const originalTitlos = document.createElement('input');
       originalTitlos.type = 'hidden';
       originalTitlos.name = 'old_titlos';
       originalTitlos.value = data.Titlos;
       form.appendChild(originalTitlos);

       const originalHmerominia = document.createElement('input');
       originalHmerominia.type = 'hidden';
       originalHmerominia.name = 'old_hmerominia';
       originalHmerominia.value = data.Hmerominia;
       form.appendChild(originalHmerominia);
   }

   ekdilosiFields.forEach(field => {
       const formGroup = document.createElement('div');
       formGroup.className = 'form-group';

       const label = document.createElement('label');
       label.htmlFor = field.name;
       label.textContent = field.label;
       if (field.required) label.classList.add('required');
       formGroup.appendChild(label);

       const input = document.createElement('input');
       input.type = field.type;
       input.name = field.name;
       input.id = field.name;
       input.required = field.required;
       if (field.min) input.min = field.min;

       if (data) {
           switch(field.name) {
               case 'titlos':
                   input.value = data.Titlos;
                   if (formType === 'Επεξεργασία') input.readOnly = true;
                   break;
               case 'hmerominia':
                   input.value = data.Hmerominia;
                   break;
               case 'ora':
                   input.value = data.Ora;
                   break;
               case 'xwros':
                   input.value = data.Xwros;
                   break;
           }
       }

       formGroup.appendChild(input);
       form.appendChild(formGroup);
   });

   const buttonsDiv = document.createElement('div');
   buttonsDiv.className = 'form-buttons';

   const submitButton = document.createElement('button');
   submitButton.type = 'submit';
   submitButton.textContent = formType;
   buttonsDiv.appendChild(submitButton);

   const cancelButton = document.createElement('button');
   cancelButton.type = 'button';
   cancelButton.textContent = 'Ακύρωση';
   cancelButton.className = 'cancel-button';
   cancelButton.onclick = () => loadSection('Εκδηλώσεις');
   buttonsDiv.appendChild(cancelButton);

   form.appendChild(buttonsDiv);
   setupFormValidation(form);
   return form;
}

async function handleEkdilosiSubmit(event, formType) {
   event.preventDefault();
   showLoading();

   try {
       // Επιπλέον έλεγχος εγκυρότητας formType
       if (formType !== 'Προσθήκη' && formType !== 'Επεξεργασία') {
           throw new Error('Μη έγκυρος τύπος φόρμας');
       }

       const formData = new FormData(event.target);
       const url = `./EKDILOSI/${formType === 'Προσθήκη' ? 'add' : 'update'}_ekdilosi.php`;

       const response = await fetch(url, {
           method: 'POST',
           body: formData
       });

       if (!response.ok) {
           const errorText = await response.text();
           throw new Error(`Σφάλμα απόκρισης: ${errorText}`);
       }

       const result = await response.json();
       if (result.status === 'error') throw new Error(result.message);

       showMessage(result.message, false);
       loadSection('Εκδηλώσεις');
   } catch (error) {
       showMessage(error.message, true);
   } finally {
       hideLoading();
   }
}

async function handleEkdilosiDelete(data) {
   if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εκδήλωση;')) {
       return;
   }

   try {
       showLoading();
       const response = await fetch('./EKDILOSI/delete_ekdilosi.php', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
       });

       if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
       }

       const result = await response.json();
       if (result.status === 'error') throw new Error(result.message);

       showMessage(result.message, false);
       await loadSection('Εκδηλώσεις');
   } catch (error) {
       showMessage(error.message, true);
   } finally {
       hideLoading();
   }
}

export {
   createEkdilosiForm,
   handleEkdilosiSubmit,
   handleEkdilosiDelete,
   ekdilosiFields
};
