import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';

const eidosFields = [
    { name: 'onoma', label: 'Όνομα', required: true, type: 'text' },
    { name: 'katigoria', label: 'Κατηγορία', required: true, type: 'select', options: ['Θηλαστικά', 'Πουλιά', 'Ερπετά'] },
    { name: 'perigrafi', label: 'Περιγραφή', required: true, type: 'textarea' }
];

function createeidosForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    form.onsubmit = (e) => handleeidosSubmit(e, formType);

    const title = document.createElement('h2');
    title.textContent = `${formType} Είδους`;
    form.appendChild(title);

    if (formType === 'Επεξεργασία' && data) {
        const originalName = document.createElement('input');
        originalName.type = 'hidden';
        originalName.name = 'original_onoma';
        originalName.value = data.Onoma;
        form.appendChild(originalName);
    }

    eidosFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.textContent = field.label;
        if (field.required) label.classList.add('required');
        formGroup.appendChild(label);

        if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.name = field.name;
            textarea.id = field.name;
            textarea.required = field.required;
            if (data && field.name === 'perigrafi') {
                textarea.value = data.Perigrafi;
            }
            formGroup.appendChild(textarea);
        } else if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            select.id = field.name;
            select.required = field.required;

            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (data && data.Katigoria === option) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            formGroup.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            input.required = field.required;

            if (data) {
                switch(field.name) {
                    case 'onoma':
                        input.value = data.Onoma;
                        if (formType === 'Επεξεργασία') {
                            input.readOnly = true;
                        }
                        break;
                }
            }

            formGroup.appendChild(input);
        }

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
    cancelButton.onclick = () => loadSection('Είδη');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form);
    return form;
}

async function handleeidosSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        const formData = new FormData(event.target);
        const url = `./EIDOS/${formType === 'Προσθήκη' ? 'add' : 'update'}_eidos.php`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        loadSection('Είδη');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handleeidosDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το είδος;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./EIDOS/delete_eidos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        await loadSection('Είδη');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createeidosForm,
    handleeidosSubmit,
    handleeidosDelete,
    eidosFields
};
