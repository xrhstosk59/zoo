// zwo.js
import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';


const zwoFields = [
    { name: 'kodikos', label: 'Κωδικός', required: true, pattern: '^[Zz]\\d{6}$', type: 'text' },
    { name: 'onoma', label: 'Όνομα', required: true, type: 'text' },
    { name: 'etos_genesis', label: 'Έτος Γέννησης', required: true, type: 'number', min: 1900, max: new Date().getFullYear() },
    { name: 'onoma_eidous', label: 'Είδος', required: true, type: 'select', dataSource: './get_species.php' }
];

function createZwoForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    form.onsubmit = (e) => handleZwoSubmit(e, formType);

    const title = document.createElement('h2');
    title.textContent = `${formType} Ζώου`;
    form.appendChild(title);

    // Add hidden field for original code when editing
    if (formType === 'Επεξεργασία' && data) {
        const originalCode = document.createElement('input');
        originalCode.type = 'hidden';
        originalCode.name = 'original_kodikos';
        originalCode.value = data.Kodikos;
        form.appendChild(originalCode);
    }

    zwoFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.textContent = field.label;
        if (field.required) label.classList.add('required');
        formGroup.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            select.id = field.name;
            select.required = field.required;

            // Populate select with options from dataSource
            fetch(field.dataSource)
                .then(response => response.json())
                .then(species => {
                    species.forEach(s => {
                        const option = document.createElement('option');
                        option.value = s.Onoma;
                        option.textContent = s.Onoma;
                        if (data && data.Onoma_Eidous === s.Onoma) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error fetching species:', error));

            formGroup.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            input.required = field.required;
            if (field.pattern) input.pattern = field.pattern;
            if (field.min !== undefined) input.min = field.min;
            if (field.max !== undefined) input.max = field.max;

            // Set values when editing
            if (data) {
                switch (field.name) {
                    case 'kodikos':
                        input.value = data.Kodikos;
                        if (formType === 'Επεξεργασία') {
                            input.readOnly = true;
                        }
                        break;
                    case 'onoma':
                        input.value = data.Onoma;
                        break;
                    case 'etos_genesis':
                        input.value = data.Etos_Genesis;
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
    cancelButton.onclick = () => loadSection('Ζώα');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form);
    return form;
}

async function handleZwoSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        const formData = new FormData(event.target);
        // Στην handleZwoSubmit 
        const url = `./ZWO/${formType === 'Προσθήκη' ? 'add' : 'update'}_zwo.php`;

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
        loadSection('Ζώα');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handleZwoDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ζώο;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./ZWO/delete_zwo.php', {
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
        if (result.status === 'error') {
            throw new Error(result.message);
        }

        showMessage(result.message, false);
        await loadSection('Ζώα');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createZwoForm,
    handleZwoSubmit,
    handleZwoDelete,
    zwoFields
};
