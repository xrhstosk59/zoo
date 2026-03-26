import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';


const tamiasFields = [
    { name: 'id', label: 'ID', required: true, type: 'number', min: 1 },
    { name: 'onoma', label: 'Όνομα', required: true, type: 'text' },
    { name: 'eponymo', label: 'Επώνυμο', required: true, type: 'text' }
];

function createTamiasForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    form.onsubmit = (e) => handleTamiasSubmit(e, formType);

    const title = document.createElement('h2');
    title.textContent = `${formType} Ταμία`;
    form.appendChild(title);

    if (formType === 'Επεξεργασία' && data) {
        const originalId = document.createElement('input');
        originalId.type = 'hidden';
        originalId.name = 'original_id';
        originalId.value = data.ID;
        form.appendChild(originalId);
    }

    tamiasFields.forEach(field => {
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
        if (field.min !== undefined) input.min = field.min;

        if (data) {
            switch(field.name) {
                case 'id':
                    input.value = data.ID;
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
    cancelButton.onclick = () => loadSection('Ταμίες');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form); 
    return form;
}

async function handleTamiasSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        const formData = new FormData(event.target);
        const url = `./TAMIAS/${formType === 'Προσθήκη' ? 'add' : 'update'}_tamia.php`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        loadSection('Ταμίες');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handleTamiasDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον ταμία;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./TAMIAS/delete_tamia.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        await loadSection('Ταμίες');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createTamiasForm,
    handleTamiasSubmit,
    handleTamiasDelete,
    tamiasFields
};
