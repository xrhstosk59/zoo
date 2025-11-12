import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';

const promitheutisFields = [
    { name: 'afm', label: 'ΑΦΜ', required: true, pattern: '^\\d{9}$', type: 'text' },
    { name: 'onoma', label: 'Όνομα', required: true, type: 'text' },
    { name: 'thlefono', label: 'Τηλέφωνο', required: true, pattern: '^^\\+?\\d{12}$', type: 'tel' },
];

function createpromitheutisForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    form.onsubmit = (e) => handlepromitheutisSubmit(e, formType);

    const title = document.createElement('h2');
    title.textContent = `${formType} Προμηθευτή`;
    form.appendChild(title);

    if (formType === 'Επεξεργασία' && data) {
        const originalAfm = document.createElement('input');
        originalAfm.type = 'hidden';
        originalAfm.name = 'original_afm';
        originalAfm.value = data.AFM;
        form.appendChild(originalAfm);
    }

    promitheutisFields.forEach(field => {
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
        if (field.pattern) input.pattern = field.pattern;

        if (data) {
            switch(field.name) {
                case 'afm':
                    input.value = data.AFM;
                    if (formType === 'Επεξεργασία') input.readOnly = true;
                    break;
                case 'onoma':
                    input.value = data.Onoma;
                    break;
                case 'thlefono':
                    input.value = data.Thlefono;
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
    cancelButton.onclick = () => loadSection('Προμηθευτές');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form); 
    return form;
}

async function handlepromitheutisSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        const formData = new FormData(event.target);
        const url = `./promitheutis/${formType === 'Προσθήκη' ? 'add' : 'update'}_promitheuti.php`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        loadSection('Προμηθευτές');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handlepromitheutisDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον προμηθευτή;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./promitheutis/delete_promitheuti.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        await loadSection('Προμηθευτές');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createpromitheutisForm,
    handlepromitheutisSubmit,
    handlepromitheutisDelete,
    promitheutisFields
};