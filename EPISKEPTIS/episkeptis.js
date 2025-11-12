import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';

const episkeptisFields = [
    {
        name: 'email',
        label: 'Email',
        required: true,
        type: 'email',
        pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
    },
    {
        name: 'onoma',
        label: 'Όνομα',
        required: true,
        type: 'text'
    },
    {
        name: 'eponymo',
        label: 'Επώνυμο',
        required: true,
        type: 'text'
    }
];

function createepiskeptisForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    form.onsubmit = (e) => handleepiskeptisSubmit(e, formType);

    const title = document.createElement('h2');
    title.textContent = `${formType} Επισκέπτη`;
    form.appendChild(title);

    if (formType === 'Επεξεργασία' && data) {
        const originalEmail = document.createElement('input');
        originalEmail.type = 'hidden';
        originalEmail.name = 'original_email';
        originalEmail.value = data.Email;
        form.appendChild(originalEmail);
    }

    episkeptisFields.forEach(field => {
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
                case 'email':
                    input.value = data.Email;
                    if (formType === 'Επεξεργασία') input.readOnly = true;
                    break;
                case 'onoma':
                    input.value = data.Onoma;
                    break;
                case 'eponymo':
                    input.value = data.Eponymo;
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
    cancelButton.onclick = () => loadSection('Επισκέπτες');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form); 
    return form;
}

async function handleepiskeptisSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        const formData = new FormData(event.target);
        const url = `./episkeptis/${formType === 'Προσθήκη' ? 'add' : 'update'}_episkepti.php`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        loadSection('Επισκέπτες');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handleepiskeptisDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον επισκέπτη;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./episkeptis/delete_episkepti.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        await loadSection('Επισκέπτες');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createepiskeptisForm,
    handleepiskeptisSubmit,
    handleepiskeptisDelete,
    episkeptisFields
};